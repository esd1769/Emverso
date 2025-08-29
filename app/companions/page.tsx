import {getAllCompanions} from "@/lib/actions/companion.actions";
import CompanionCard from "@/app/companions/CompanionCard";
import {getSubjectColor} from "@/lib/utils";
import SearchInput from "@/components/SearchInput";
import SubjectFilter from "@/components/SubjectFilter";


const CompanionsLibrary = async({searchParams}:SearchParams) => {
   const filter=await searchParams;
   const subject=filter.subject?filter.subject:"";
   const topic=filter.topic?filter.topic:"";
   const companions=await getAllCompanions({subject,topic});
   //console.log('param=',companions);
    //default flex  alignment is justify-start..horizental
    return (
        <main className="flex justify-center gap-4 max-sm:flex-col">
            <section>
                <h1>Companion Library</h1>
                <div className=" flex gap-4">
                    <SearchInput/>
                    <SubjectFilter/>
                </div>
            </section>

            <section className="companions-grid">
                {companions.map((companion) => (
                    <CompanionCard 
                        key={companion.id}
                        {...companion}
                        color={getSubjectColor(companion.subject)}
                        isAuthor={companion.isAuthor}
                    />

                ))}

            </section>


            </main>
    )
}
export default CompanionsLibrary
