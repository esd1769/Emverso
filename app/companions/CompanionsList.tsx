import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {cn, getSubjectColor} from "@/lib/utils";
import Link from "next/link";
import Image from "next/image"


interface companionsListprops {
    title: string
    companions?: Companion[]
    classNames?: string
}

const CompanionsList = ({title,companions,classNames}:companionsListprops) => {
    return (
        <article className = {cn('companion-list',classNames)}>
            <h2 className="font-bold text-3xl">{title}</h2>
            <Table>

                <TableHeader>
                    <TableRow>
                        <TableHead className="text-lg w-2/3">Lessons</TableHead>
                        <TableHead className="text-lg">Subject</TableHead>
                        <TableHead className="text-lg text-right">Duration</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody >
                    {companions?.map(({id,subject,name,topic,duration},index) => (
                        <TableRow key={id + '-' + index} >
                            <TableCell>
                                <Link href={`/companions/${id}`}>
                                    <div className="flex items-center gap-2">
                                        <div className="size-[72px] flex items-center
                                        justify-center rounded-lg max-md:hidden"
                                        style={{backgroundColor:getSubjectColor(subject)}}>
                                            {/*//image with first letter of subject*/}
                                            <div
                                                className="flex items-center justify-center rounded-full w-[72px] h-[72px] text-white font-extrabold text-5xl border-2 border-black"
                                                style={{ backgroundColor: getSubjectColor(subject) }}
                                            >
                                                {subject[0]?.toUpperCase()}
                                            </div>



                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <p className="font-bold text-2xl">
                                                {subject}
                                                {" "}
                                                {name}
                                            </p>
                                            <p className="text-lg">
                                                {topic}
                                            </p>


                                        </div>


                                    </div>
                                </Link>
                            </TableCell>
                            <TableCell>
                                <div className="subject-badge w-fit
                                max-md:hidden">
                                    {subject}
                                </div>
                                <div className="flex items-center justify-center
                                rounded-lg w-fit p-2 md:hidden"
                                     style={{backgroundColor:getSubjectColor(subject)}}>
                                    {/*//image with first letter of subject*/}
                                    <div
                                        className="flex items-center justify-center rounded-full w-[72px] h-[72px] text-white font-extrabold text-5xl border-2 border-black"
                                        style={{ backgroundColor: getSubjectColor(subject) }}
                                    >
                                        {subject[0]?.toUpperCase()}
                                    </div>


                                </div>

                            </TableCell>
                            <TableCell>
                                <div className="flex items-center justify-end gap-2 w-full ">
                                    <p className="text-2xl">
                                    {duration}{' '}
                                        <span className="max-md:hidden">mins</span>
                                    </p>
                                    <Image src="/icons/clock.svg" alt="minutes"
                                           height={14} width={14}  className="md:hidden"
                                           />

                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </article>
    )
}
export default CompanionsList
