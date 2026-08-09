import { JwtService } from '@nestjs/jwt';
import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  WebSocketServer,
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
    } catch {
      console.log('wrong');
      client.disconnect();
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
    return await emitNewReport({
      reportRepo: this.reportRepo,
      server: this.server,
      callback: true,
    });
  }
}
