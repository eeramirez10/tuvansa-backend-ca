import { Request, Response } from "express";
import { AccountStatementRepository } from '../../domain/repositories/account-statement.repository';
import { AccountStatementPaginationDto } from '../../domain/dto/account-statement/account-statement-pagination.dto';
import { EmailService } from '../../infrastructure/services/mail.service';


interface sendAccountStatementsDto {

  to: string
  subject: string,
  htmlContent: string,
  clientName: string,
  date: string


}




export class AccountStetementsController {

  constructor(
    private readonly accountStatementRepository: AccountStatementRepository,
    private readonly emailService: EmailService
  ) { }


  getAll = async (req: Request, res: Response) => {

    const [error, dto] = AccountStatementPaginationDto.execute({ ...req.query })

    if (error) {

      res.status(400).json({ error })
      return
    }

    try {
      const data = await this.accountStatementRepository.getAll(dto!)

      res.json({ ...data })

    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Server Error' })
    }




  }

  sendAccountStatements = async (req: Request, res: Response) => {

    const body = req.body as sendAccountStatementsDto;

    try {
      const data = await this.emailService.sendEmail({
        to: body.to,
        subject: body.subject,
        htmlBody: body.htmlContent

      })

      res.json(data)

    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Server Error' })
    }




  }
}