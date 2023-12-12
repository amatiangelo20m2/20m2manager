/**
 * OpenAPI definition
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v0
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

export interface BranchResponseEntity {
    name?: string;
    address?: string;
    email?: string;
    phone?: string;
    vat?: string;
    type?: BranchResponseEntity.TypeEnum;
    branchCode?: string;
    role?: BranchResponseEntity.RoleEnum;
}
export namespace BranchResponseEntity {
    export type TypeEnum = 'RESTAURANT' | 'SUPPLIER';
    export const TypeEnum = {
        RESTAURANT: 'RESTAURANT' as TypeEnum,
        SUPPLIER: 'SUPPLIER' as TypeEnum
    };
    export type RoleEnum = 'OWNER' | 'ADMIN' | 'EMPLOYEE' | 'BARMAN';
    export const RoleEnum = {
        OWNER: 'OWNER' as RoleEnum,
        ADMIN: 'ADMIN' as RoleEnum,
        EMPLOYEE: 'EMPLOYEE' as RoleEnum,
        BARMAN: 'BARMAN' as RoleEnum
    };
}
