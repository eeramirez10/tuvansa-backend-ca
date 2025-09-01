import { Request, Response } from "express";
import { ReqUser } from "../middlewares/auth.middleware";
import { CustomerRepository } from '../../domain/repositories/customer.repository';
import { CustomerPaginationDto } from "../../domain/dto/customer-pagination.dto";





export class CustomerController {

  constructor(private readonly customerRepository: CustomerRepository,) {


  }

  getCustomers = async (req: Request, res: Response) => {


    const [error, customerPaginationDto] = CustomerPaginationDto.execute({ ...req.query })

    if (error) {

      res.status(400).json({ error })
      return
    }

    try {

      const customers = await this.customerRepository.getList(customerPaginationDto!)

      res.json({ ...customers })

    } catch (error) {

      console.log(error)

      res.status(500).json({ error: 'Hubo un error' })

    }



    // console.log({ repo: this.invoicesRepository})





  }

  getById = async (req: Request, res: Response) => {

    const customerId = req.params.customerId as string || undefined

    if(!customerId) {
          res.status(400).json({ error:'customerId is required' })
      return
    }
   


    try {

      const customer = await this.customerRepository.getById(customerId)

      res.json({ ...customer })

    } catch (error) {

      console.log(error)

      res.status(500).json({ error: 'Hubo un error' })

    }



    // console.log({ repo: this.invoicesRepository})





  }





}