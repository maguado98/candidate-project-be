import { Controller, Post, UploadedFile, UseInterceptors, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CandidatesService } from './candidates.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';

@Controller('candidates')
export class CandidatesController {
    constructor(private readonly svc: CandidatesService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async upload(
        @UploadedFile() file: Express.Multer.File,
        @Body('name') name: string,
        @Body('surname') surname: string
    ): Promise<CreateCandidateDto[]> {
        const dtos = await this.svc.parseExcel(file.buffer);
        return dtos.map(dto => ({ ...dto, name, surname }));
    }
}
