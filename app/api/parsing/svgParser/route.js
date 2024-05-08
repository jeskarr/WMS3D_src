import { NextResponse } from "next/server";
import { JSDOM } from 'jsdom'

export const POST = async (req) => {
    let fileData = await req.json();
    fileData = fileData.data.toString();

    let err = false;
    err = !isValidSvg(fileData);

    if(err) {
        return NextResponse.json(
            {
                message: 'Il file SVG è in un formato non valido',
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

function isValidSvg(svgData) {
    // Check if there is at least one polygon element with points  
    const dom = new JSDOM(svgData, { contentType: 'image/svg+xml' });
    const { document } = dom.window;
    let polygons = document.getElementsByTagName('polygon');
    polygons = Array.from(polygons).filter(polygon => polygon.getAttribute('points'));

    if (polygons.length > 0) {
        return true;
    } 
    else {
        return false;
    }
}