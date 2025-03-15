import { NextApiRequest, NextApiResponse } from 'next'
import { createAvailability } from '~/app/_actions/schedule/actions'
import { DoctorAvailabilitiesInterface } from '~/server/db/type';

export const POST = async(request:Request) => {
    const body = await request.json();
    console.log("body" + JSON.stringify(body));
    const formData = new FormData()
    formData.append("day", body.day)
    formData.append("start-time", body["start-time"])
    formData.append("end-time", body["end-time"])
    const result = await createAvailability(formData)
    console.log(result)
    return Response.json(result);
}