"use client"
import React, {use, useEffect, useState} from 'react'
import Image from "next/image"

import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {formUrlQuery, removeKeysFromUrlQuery} from "@jsmastery/utils";
import {Input} from "@/components/ui/input";

const SearchInput = () => {
    const pathname=usePathname();

    const router = useRouter();
    const searchParams=useSearchParams();
    const query= searchParams.get('query') || '';
    const [searchQuery, setSearchQuery] = useState("");
    useEffect(() => {
        const delayDebounceFn = setTimeout(()=> {
            if (searchQuery) {
                const newUrl = formUrlQuery({
                    params: searchParams.toString(),
                    key: "topic",
                    value: searchQuery,
                });

                router.push(newUrl, { scroll: false });
            } else {
                if (pathname === "/companions") {
                    const newUrl = removeKeysFromUrlQuery({
                        params: searchParams.toString(),
                        keysToRemove: ["topic"],
                    });

                    router.push(newUrl, { scroll: false });
                }
            }


        },500)


    },[searchQuery, pathname,router,searchParams]);
    return (
        <div className="flex gap-2 items-center w-full">
            <Image src="/icons/search.svg" alt="search icon"
                   width={15} height={15}/>

            <Input
                type="text"
                placeholder="Search by Companions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-black rounded-lg px-3 py-2"
            />





        </div>
    )
}
export default SearchInput
