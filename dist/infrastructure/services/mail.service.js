"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const envs_1 = require("../../config/envs");
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: envs_1.Envs.getEnvs().MAIL_SERVICE,
            host: envs_1.Envs.getEnvs().EMAIL_HOST,
            port: 587,
            secure: false,
            auth: {
                user: envs_1.Envs.getEnvs().EMAIL_ACCOUNT,
                pass: envs_1.Envs.getEnvs().EMAIL_PASSWORD,
            },
        });
    }
    sendEmail(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { to, subject, htmlBody, attachments } = options;
            const info = yield this.transporter.sendMail({
                from: envs_1.Envs.getEnvs().EMAIL_ACCOUNT,
                to, // list of receivers
                subject: subject, // Subject line
                html: htmlBody,
                attachments
            });
            console.log("Message sent: %s", info.messageId);
            // console.log(info)
        });
    }
}
exports.EmailService = EmailService;
