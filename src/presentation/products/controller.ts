import { Request, Response } from "express";
import { GetByEanAndBranchRequestDto } from '../../domain/dto/products/get-by-ean-and-branch-request.dto';

import { ProductsRepository } from '../../domain/repositories/products.repository';
import { GetByEanResponseDto } from "../../domain/dto/products/get-by-ean-response.dto";
import { GetProductAvailabilityRequestDto } from "../../domain/dto/products/get-product-availability-request.dto";
import { GetProductsAvailabilityBatchRequestDto } from "../../domain/dto/products/get-products-availability-batch-request.dto";
import { GetErpProductByEanAndBranchUseCase } from "../../use-cases/products/get-product-by-ean-and-branch.use-case";
import { GetProductAvailabilityUseCase } from "../../use-cases/products/get-product-availability.use-case";
import { GetProductsAvailabilityBatchUseCase } from "../../use-cases/products/get-products-availability-batch.use-case";
import { SearchMexicoProductsRequestDto } from "../../domain/dto/products/search-mexico-products-request.dto";
import { SearchMexicoProductsUseCase } from "../../use-cases/products/search-mexico-products.use-case";
import { GetMexicoProductByCodeUseCase } from "../../use-cases/products/get-mexico-product-by-code.use-case";


export class ProductsController {

  private readonly getByEanAndBranchUseCase: GetErpProductByEanAndBranchUseCase;
  private readonly getProductAvailabilityUseCase: GetProductAvailabilityUseCase;
  private readonly getProductsAvailabilityBatchUseCase: GetProductsAvailabilityBatchUseCase;
  private readonly searchMexicoProductsUseCase: SearchMexicoProductsUseCase;
  private readonly getMexicoProductByCodeUseCase: GetMexicoProductByCodeUseCase;

  constructor(repository: ProductsRepository) {
    this.getByEanAndBranchUseCase = new GetErpProductByEanAndBranchUseCase(repository);
    this.getProductAvailabilityUseCase = new GetProductAvailabilityUseCase(repository);
    this.getProductsAvailabilityBatchUseCase = new GetProductsAvailabilityBatchUseCase(repository);
    this.searchMexicoProductsUseCase = new SearchMexicoProductsUseCase(repository);
    this.getMexicoProductByCodeUseCase = new GetMexicoProductByCodeUseCase(repository);
  }

  searchMexicoProducts = async (req: Request, res: Response): Promise<void> => {
    const [error, dto] = SearchMexicoProductsRequestDto.execute(req.query.query);
    if (error) {
      res.status(400).json({ error });
      return;
    }

    try {
      res.status(200).json(await this.searchMexicoProductsUseCase.execute(dto!.term));
    } catch (cause) {
      console.error("search_mexico_products_failed", cause);
      res.status(500).json({ error: "Internal error" });
    }
  }

  getMexicoProductByCode = async (req: Request, res: Response): Promise<void> => {
    const [error, dto] = SearchMexicoProductsRequestDto.execute(req.params.code);
    if (error) {
      res.status(400).json({ error });
      return;
    }

    try {
      const product = await this.getMexicoProductByCodeUseCase.execute(dto!.term);
      if (!product) {
        res.status(404).json({ error: "Product not found in Mexico branch" });
        return;
      }
      res.status(200).json(product);
    } catch (cause) {
      console.error("get_mexico_product_by_code_failed", cause);
      res.status(500).json({ error: "Internal error" });
    }
  }


  getProductByEanAndBranch = async (req: Request, res: Response) => {

    console.log(req.params)

    const [error, dto] = GetByEanAndBranchRequestDto.execute({ ...req.params })

    if (error) {

      res.status(400).json({ error })
      return
    }


    this.getByEanAndBranchUseCase.execute(dto!)
      .then((products: GetByEanResponseDto[]) => {
        res.json(products )
      })
      .catch((error: unknown) => {

        console.log(error)

        res.status(500).json({
          error:'Internal error'
        })
      })



  }

  getAvailability = async (req: Request, res: Response): Promise<void> => {
    const [error, dto] = GetProductAvailabilityRequestDto.execute(req.params.ean);
    if (error) {
      res.status(400).json({ error });
      return;
    }

    try {
      const product = await this.getProductAvailabilityUseCase.execute(dto!.ean);
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      res.status(200).json(product);
    } catch (error) {
      console.error("get_product_availability_failed", error);
      res.status(500).json({ error: "Internal error" });
    }
  }

  getAvailabilityBatch = async (req: Request, res: Response): Promise<void> => {
    const [error, dto] = GetProductsAvailabilityBatchRequestDto.execute(req.body);
    if (error) {
      res.status(400).json({ error });
      return;
    }

    try {
      const items = await this.getProductsAvailabilityBatchUseCase.execute(dto!.eans);
      res.status(200).json({
        itemsCount: items.length,
        requestedCount: dto!.eans.length,
        missingEans: dto!.eans.filter((ean) => !items.some((item) => item.ean === ean)),
        items,
      });
    } catch (error) {
      console.error("get_products_availability_batch_failed", error);
      res.status(500).json({ error: "Internal error" });
    }
  }
}
