"use client"
import React, {useEffect, useState} from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {subjects} from "@/constants";
import { Input } from "@/components/ui/input"
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {formUrlQuery, removeKeysFromUrlQuery} from "@jsmastery/utils";

const SubjectFilter = () => {
    const pathname=usePathname();

    const router = useRouter();
    const searchParams=useSearchParams();
    const query= searchParams.get('subject') || '';
    const [subject,setSubject] = useState(query);
    useEffect(() => {

        let newUrl='';
        if  (subject==='all')  {
            newUrl = removeKeysFromUrlQuery({
                params: searchParams.toString(),
                keysToRemove: ["subject"],
            });

            //router.push(newUrl, { scroll: false });
        }
        else {
            newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: "subject",
                value: subject,
            });

            //router.push(newUrl, { scroll: false });
        }
        router.push(newUrl, { scroll: false });




    },[subject, pathname,router,searchParams]);
    return (
        <Input
            type="text"
            placeholder="Search by subject..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border border-black rounded-lg px-3 py-2"
        />
    )

}
export default SubjectFilter
