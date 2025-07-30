import { PartialType } from '@nestjs/swagger';
import { CreateLogsRecordDto } from './create-logs-record.dto';

export class UpdateLogsRecordDto extends PartialType(CreateLogsRecordDto) {}
