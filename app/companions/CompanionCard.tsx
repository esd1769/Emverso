"use client";
import React, {useState} from 'react'
import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {addBookmark, deleteCompanion, removeBookmark} from "@/lib/actions/companion.actions";
import {getSubjectColor} from "@/lib/utils";

interface CompanionCardProps {
    id: string
    name: string
    topic: string
    subject: string
    duration: number
    bookmarked: boolean
    isAuthor?: boolean
}

const CompanionCard = ({id,name,topic,subject,duration,bookmarked,isAuthor}:CompanionCardProps) => {
    const [isBookmarked, setIsBookmarked] = useState(bookmarked);

    const pathname=usePathname();

        const handleBookmark = async () => {
            if (isBookmarked) {
                await removeBookmark(id, pathname);
                setIsBookmarked(false);
            } else {
                await addBookmark(id, pathname);
                setIsBookmarked(true);
            }
        }
    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${name}?`)) return;
        try {
            await deleteCompanion(id);  // call the new action
            alert(`${name} deleted successfully`);
            // optional: remove card from UI, e.g., set a local state to hide it
        } catch (err) {
            alert('Failed to delete companion');
            console.error(err);
        }
    }





    return (
        <article
            className= "companion-card"
            style={{backgroundColor: getSubjectColor(subject)}}>
            <div className= "flex justify-between items-center">
                <div
                    className="subject-badge flex items-center justify-center rounded-full w-8 h-8 text-white font-bold"
                    style={{ backgroundColor: getSubjectColor(subject) }}
                >
                    {subject[0]?.toUpperCase()}
                </div>

                <button className="companion-bookmark"
                            onClick={handleBookmark}>
                        <Image src={
                            isBookmarked ? "/icons/bookmark-filled.svg" : "/icons/bookmark.svg"
                        } alt="bookmark"
                               width={12.5} height={20}

                        />
                    </button>

            </div>
            <h2 className="text-2xl font-bold">  {name}</h2>
            <p className="text-sm">{topic}</p>
            <div className= "flex items-center gap-2">
                <Image src="/icons/clock.svg" alt="duration"
                       width={13.5}height={3.5}
                       />
                <p className="text-sm">{duration} minutes</p>
            </div>
            <Link href={`/companions/${id}`} className="w-full">
                <button className="btn-primary w-full justify-center">
                    Launch Session
                </button>






            </Link>
















            {/* Delete button - only shown to the author */}
            {isAuthor && (
                <button
                    className="btn-delete w-full mt-2 relative overflow-hidden rounded-lg font-bold text-sm py-1.5 px-3 transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl"
                    onClick={handleDelete}
                    style={{
                        background: '#0b1e3a', // dark bluish
                        color: '#FFFF66',       // yellow neon
                        border: 'none',
                        outline: 'none',
                    }}
                >
                    <span className="relative z-10">Delete Companion</span>

                    {/* Neon glow */}
                    <div
                        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                        style={{
                            background: 'radial-gradient(circle, rgba(255,255,102,0.3) 0%, rgba(255,255,102,0) 80%)',
                            filter: 'blur(10px)',
                        }}
                    ></div>

                    {/* Animated neon outline */}
                    <div
                        className="absolute -inset-0.5 rounded-lg opacity-75 animate-neon-pulse"
                        style={{
                            background: 'conic-gradient(from 90deg at 50% 50%, #FFFF66 0%, #FFD700 50%, #FFFF66 100%)',
                            filter: 'blur(4px)',
                        }}
                    ></div>

                    {/* Sparkle/star animation */}
                    <div className="sparkle"></div>
                </button>
            )}

            <style jsx>{`
                @keyframes neon-pulse {
                    0% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.05); opacity: 1; }
                    100% { transform: scale(1); opacity: 0.5; }
                }
                .animate-neon-pulse {
                    animation: neon-pulse 2s infinite ease-in-out;
                    position: relative;
                }
                @keyframes sparkle {
                    0%, 100% { opacity: 0; transform: translate(0,0) scale(0.5); }
                    50% { opacity: 1; transform: translate(calc(-50% + 50%), calc(-50% + 50%)) scale(1); }
                }
                .sparkle {
                    position: absolute;
                    width: 3px;
                    height: 3px;
                    background: #FFFF66;
                    border-radius: 50%;
                    top: 50%;
                    left: 50%;
                    animation: sparkle 1.5s infinite;
                }
            `}</style>



















        </article>
    )
}
export default CompanionCard
