import { MigrationInterface, QueryRunner } from 'typeorm';

export class createAuditLogsTable1744642300000 implements MigrationInterface {
    name = 'createAuditLogsTable1744642300000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "audit_logs" (
            "id" SERIAL NOT NULL,
            "action" character varying(50) NOT NULL,
            "module" character varying(50) NOT NULL,
            "entityId" character varying(100) NOT NULL,
            "data" jsonb NOT NULL,
            "userId" character varying(50) NOT NULL,
            "ipAddress" character varying(50) NOT NULL,
            "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY ("id")
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "audit_logs"`);
    }
}
