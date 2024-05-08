import { NextResponse } from "next/server";

export const POST = async (req) => {
    let fileData = await req.json();

    let err = false;
    err = !isValidJson(fileData);

    if(err) {
        return NextResponse.json(
            {
                message: 'Il file JSON è in un formato non valido',
                err: true,
            }, 
            {
                status: 200
            }
        );
    }
    return NextResponse.json(
        {
            message: 'OK',
            err: false,
        },
        {
            status: 200
        }
    );
}



function isValidJson(jsonData) {
    if (!jsonData.hasOwnProperty("products") || !jsonData.hasOwnProperty("shelves") || 
        !jsonData.hasOwnProperty("whsName") || !jsonData.hasOwnProperty("whsHeight") || 
        !jsonData.hasOwnProperty("whsPoints") || !jsonData.hasOwnProperty("movements")){
        return false;
    }

    if (!Array.isArray(jsonData.products) || !Array.isArray(jsonData.shelves) || 
        !Array.isArray(jsonData.whsPoints) || !Array.isArray(jsonData.movements)) {
        return false;
    }

    for (const point of jsonData.whsPoints) {
        if (typeof point !== 'object') {
            return false;
        }
    }

    for (const product of jsonData.products) {
        if (typeof product.id !== 'string' || typeof product.name !== 'string' || 
            typeof product.color !== 'object') {
            return false;
        }
    }

    for (const shelf of jsonData.shelves) {
        if (typeof shelf.id !== 'string' || typeof shelf.name !== 'string' || 
            typeof shelf.binSize !== 'number' || typeof shelf.width !== 'number' || 
            typeof shelf.height !== 'number' || typeof shelf.isFlipped !== 'boolean' ||
            !Array.isArray(shelf.bins)) {
            return false;
        }

        for (const row of shelf.bins) {
            for (const bin of row) {
                if (typeof bin.id !== 'string' || typeof bin.state !== 'string' ||
                    (typeof bin.productId !== 'string' && bin.productId !== null)) {
                    return false;
                }
            }
        }
    }

    return true;
}