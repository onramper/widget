/* Copyright ONRAMPER | SAFUDEX B.V. - All Rights Reserved
 * Proprietary and confidential
 * 
 * @url:https://onramper.com
 */

export interface CoreHttpResponse {
    statusCode?: number | undefined;
    headers?: {
        [header: string]: boolean | number | string;
    } | undefined;
    body?: string | undefined;
    isBase64Encoded?: boolean | undefined;
    cookies?: string[] | undefined;
}

