import { Module } from '@nestjs/common';
import { SaleController } from './api/sale.controller';
import { SaleService } from './core/services/sale.service';
import { SaleRepository } from './infrastructure/persistence/sale.repository';
import { InventoryModule } from '../inventory/inventory.module';
import { CustomersModule } from '../customers/customers.module';
import { CatalogModule } from '../catalog/catalog.module';
import { SaleItemController } from './api/sale-item.controller';
import { SaleItemService } from './core/services/sale-item.service';
import { SaleItemRepository } from './infrastructure/persistence/sale-item.repository';

@Module({
  imports: [InventoryModule, CustomersModule, CatalogModule],
  controllers: [SaleController, SaleItemController],
  providers: [SaleService, SaleRepository, SaleItemService, SaleItemRepository],
  exports: [SaleService],
})
export class SalesModule {}
