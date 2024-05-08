import { NextResponse } from "next/server";

export const POST = async (req) => {
    let movementId = await req.json();
    movementId = movementId.id.toString();

    // This API will be developed by SanMarco Informatica. 
    // This is just a mock.

    let status = true;
    /* Status:
        false = denied
        true = accepted
    */

    const randomNumber = Math.random();

    if (randomNumber < 0.25) {
        status = false;
    }

    const msg =  status ? `La richiesta ${movementId} è stata accettata.` : 
    `La richiesta ${movementId} è stata rifiutata.`

    return NextResponse.json(
        {
            msg: msg,
            requestStatus: status
        },
        {
            status: 200
        }
    );
}
