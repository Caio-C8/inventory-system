import { Module } from '@nestjs/common';

import { SaleController } from './api/sales.controller';
import { SaleService } from './core/services/sale.service';
import { SaleRepository } from './infrastructure/persistence/sale.repository';
import { InventoryModule } from '../inventory/inventory.module';
import { CustomersModule } from '../customers/customers.module';
import { CatalogModule } from '../catalog/catalog.module';

@Module({
  imports: [InventoryModule, CustomersModule, CatalogModule],
  controllers: [SaleController],
  providers: [SaleService, SaleRepository],
  exports: [SaleService],
})
export class SalesModule {}
