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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicFtpStorageAdapter = void 0;
const basic_ftp_1 = require("basic-ftp");
const ftp_storage_adapter_1 = require("../../domain/adapters/ftp-storage.adapter");
const stream_1 = require("stream");
const custom_error_1 = require("../../domain/errors/custom-error");
class BasicFtpStorageAdapter extends ftp_storage_adapter_1.FtpStorageAdapter {
    constructor() {
        super();
        this.client = new basic_ftp_1.Client();
        this.opts = {
            host: process.env.FTP_HOST,
            port: Number(process.env.FTP_PORT || 21),
            user: process.env.FTP_USER,
            password: process.env.FTP_PASS,
            secure: process.env.FTP_SECURE === 'true',
        };
    }
    download(remotePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.access(this.opts);
                const pass = new stream_1.PassThrough();
                const chunks = [];
                pass.on('data', (chunk) => chunks.push(chunk));
                // Lo pasamos como destino al downloadTo
                yield this.client.downloadTo(pass, remotePath);
                yield this.client.close();
                return Buffer.concat(chunks);
            }
            catch (error) {
                if (error instanceof basic_ftp_1.FTPError) {
                    if (error.code === 550) {
                        throw custom_error_1.CustomError.notFound('File not found');
                    }
                }
                throw new Error('Erroro desconocido');
            }
        });
    }
}
exports.BasicFtpStorageAdapter = BasicFtpStorageAdapter;
