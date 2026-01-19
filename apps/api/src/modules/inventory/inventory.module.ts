import { Module } from '@nestjs/common';
import { BatchController } from './api/batch.controller';
import { BatchRepository } from './infrastructure/persistence/batch.repository';
import { BatchService } from './core/services/batch.service';
import { PrismaService } from 'src/common/persistence/prisma.service';
import { CatalogModule } from '../catalog/catalog.module';

@Module({
  imports: [CatalogModule],
  controllers: [BatchController],
  providers: [BatchService, BatchRepository, PrismaService],
  exports: [BatchService],
})
export class InventoryModule {}
