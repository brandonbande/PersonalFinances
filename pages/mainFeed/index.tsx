import type { NextPage } from 'next';
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useState, useEffect } from "react";
import {Text} from "@nextui-org/react";
import FinanceCard from "../../components/FinanceCard"
import  balance from '../../pages/recordFinances'


const MainFeed: NextPage = () => {
    const supabaseClient = useSupabaseClient();
    const user = useUser();
    const router = useRouter();
    const [finances, setFinances] = useState<string[]>([]);

    useEffect(() => {
        getFinances();
    }, []);

    const getFinances = async () => {
        try {
            const { data, error } = await supabaseClient
                .from("personalfinance")
                .select("*")
                .limit(10)
           console.log(data);
            if(data != null) {
                setFinances(data);
            }
        } catch (error: any) {
            alert(error.message);
        }
    }
    
    /*
        articles = [
            article object 1,
            article object 2
        ]

        <ArticleCard article={object} />
    */
    return (
        <>
            <Text h2>Main  Feed </Text>
            <h2 className="text-3xl">
            
            ${
               
               Number(balance).toFixed(2)
             }
 
 
       </h2>
            <Text size="$lg" css={{my: "$8"}}>
                Check out incomes and expenses from here
            </Text>
            {/* Article Card */}
            {finances.map((finance) => (
                <FinanceCard finance={finance}/>
            ))}
            
        </>
    )
}

export default MainFeed;