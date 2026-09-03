import { JwtService } from '@nestjs/jwt';
import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { Repository } from 'typeorm';
import { Report } from '../crime-report/crime-report-entities/report.entity';
import { sendReportCount } from './chat-gateway-utils/sendReportCount.util';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { sendReports } from './chat-gateway-utils/sendReports.util';
import { updateReport } from './chat-gateway-utils/updateReport.util';
import { createClient } from '@supabase/supabase-js';
import { sendEvidence } from './chat-gateway-utils/sendEvidence.util';
import { relayAlert } from './chat-gateway-utils/relayAlert.util';
import { sendAlerts } from './chat-gateway-utils/sendAlerts.util';
import { emitNewReport } from 'src/Utilities/newReportEmitter';
import { SecurityTip } from 'src/Entities/saveTip.entity';
import { saveTip } from './chat-gateway-utils/saveTip.util';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:5173',
      'https://crime-reporting-system-k3lz.onrender.com',
    ],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepo: Repository<Report>,
    @InjectRepository(SecurityTip)
    private readonly securityTipRepo: Repository<SecurityTip>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  @WebSocketServer()
  server!: Server;

  // ====== HANDLE CONNECTION ======
  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      console.log(token);
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      });
      client.data.user = payload;
      client.join(payload.username);
    } catch (error) {
      console.log(error);
      client.disconnect();
      // setTimeout(() => {
      //   client.disconnect();
      // }, 100);
      // throw new WsException('Unauthorized user access!');
    }
  }

  // ====== NOTIFY ADMINS THAT A REPORT WHAS JUST MADE ======
  @SubscribeMessage('report-sent')
  async notifyAdmins(@MessageBody() payload: { reportId: string }) {
    await relayAlert({
      reportId: payload.reportId,
      reportRepo: this.reportRepo,
      server: this.server,
    });
  }

  // ====== SEND ALERTS (REPORTS MADE WITHIN THE LAST 24 HOURS) ======
  @SubscribeMessage('alerts')
  async sendAlerts(@ConnectedSocket() client: Socket) {
    return await sendAlerts({ reportRepo: this.reportRepo });
  }

  // ====== SEND REPORT COUNT ======
  @SubscribeMessage('report-count')
  async sendReportCount(@ConnectedSocket() client: Socket) {
    return await sendReportCount({ reportRepo: this.reportRepo });
  }

  // ====== SEND RECENT REPORTS ======
  @SubscribeMessage('recent-reports')
  async sendRecentReports(@ConnectedSocket() client: Socket) {
    const { sendRecent } = await sendReports({
      reportRepo: this.reportRepo,
    });
    return await sendRecent();
  }

  // ====== SEND ALL REPORTS ======
  @SubscribeMessage('reports')
  async sendAllReports(@ConnectedSocket() client: Socket) {
    const { sendAll } = await sendReports({
      reportRepo: this.reportRepo,
    });
    return await sendAll();
  }

  // ====== UPDATE REPORT STATUS ======
  @SubscribeMessage('update-report')
  async updateReport(@MessageBody() data: any) {
    const supabase = createClient(
      this.configService.get<string>('SUPABASE_URL')!,
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    return await updateReport({
      reportRepo: this.reportRepo,
      action: data.action,
      reportId: data.reportId,
      supabase,
    });
  }

  // ====== SEND EVIDENCE ======
  @SubscribeMessage('get-evidence')
  async sendEvidence(@MessageBody() reportId: string) {
    const supabase = createClient(
      this.configService.get<string>('SUPABASE_URL')!,
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    return await sendEvidence({ reportId, supabase });
  }

  // ====== Emit New Report ======
  @SubscribeMessage('notification')
  async sendNewReportNotification() {
    try {
      return await emitNewReport({
        reportRepo: this.reportRepo,
        server: this.server,
        callback: true,
      });
    } catch (error) {
      console.log('ERROR:', error);
      return { error: 'Unable to get notifications!' };
    }
  }

  // ====== SAVE SAFETY/SECURITY TIP ======
  @SubscribeMessage('save-tip')
  async saveTip(@MessageBody() payload: any) {
    return await saveTip({
      securityTipRepo: this.securityTipRepo,
      payload,
    });
  }

  // ====== GET SAFETY/SECURITY TIPS ======
  @SubscribeMessage('get-tips')
  async sendTips() {
    try {
      return await this.securityTipRepo.find();
    } catch (error) {
      console.log(error);
      return { error: 'Unable to get security tips!' };
    }
  }

  // ====== UPDATE SAFETY/SECURITY TIP ======
  @SubscribeMessage('update-tip')
  async updateTip(
    @MessageBody()
    payload: {
      newTitle: string;
      title: string;
      message: string;
    },
  ) {
    if (payload.newTitle !== payload.title) {
      const titleExists = await this.securityTipRepo.findOne({
        where: { title: payload.newTitle },
      });
      if (titleExists) {
        return { error: 'A tip with this title already exists!' };
      }
    }
    await this.securityTipRepo.update(
      { title: payload.title },
      { title: payload.newTitle, message: payload.message },
    );
    return {
      message: 'Tip has been updated successfully',
      tips: await this.securityTipRepo.find(),
    };
  }
}
