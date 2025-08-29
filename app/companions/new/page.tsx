import React from 'react'
import CompanionForm from "@/app/companions/CompanionForm";
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {newCompanionPermissions} from "@/lib/actions/companion.actions";
import Link from "next/link";
import Image from "next/image";
//no ned for nextjs projects as it does automatically

const NewCompanion = async() => {
    const {userId}=await auth();
    if (!userId) redirect(`/sign-in`);

    const canCreatecompanion=await newCompanionPermissions();
    return (
        <main className="min-lg:w-1/3 min-md:w-2/3 items-center justify-center">
        {canCreatecompanion ?(

            <article className="w-full gap-4 flex flex-col ">
                <h1>Companion Builder</h1>
                <CompanionForm />
            </article>):(

            <article className="companion-limit ">
                <Image src='/images/limit.svg'
                       alt='Companion limit reached' width={360} height={230} />
                <div className='cta-badge'>
                    Upgrade your plan
                </div>

                <h1>You have Reached Your Limit</h1>

                <p>You have reached the limit of companions you can create.
                    Please upgrade your plan to create more companions.
                </p>
                <Link href='/subscription' className='btn-primary'>Upgrade My plan</Link>


            </article>



        ) }
        </main>
    )
}
export default NewCompanion
