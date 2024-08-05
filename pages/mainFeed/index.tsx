import type { NextPage } from 'next';
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { useState, useEffect } from "react";
import {Text} from "@nextui-org/react";
import FinanceCard from "../../components/FinanceCard"



const MainFeed: NextPage = () => {
    const supabaseClient = useSupabaseClient();
    const user = useUser();
    const router = useRouter();
    const [finances, setFinances] = useState<string[]>([]);
    
function getBalance(transactionsdata: any[]) { //use data from supabase
        const expenseData = transactionsdata.filter((transaction) => transaction.category === 'expenses'); //get all exp
        const incomeData = transactionsdata.filter((transaction) => transaction.category === 'incomes'); // get all income
      
        const totalExpenses = expenseData.reduce((acc, current) => acc + parseFloat(current.amount.replace('$', '').replace(',' , '')), 0); // start w total iri 0 ,
      //per array item in expenses remove dollar sign
      //add value to  the current total
        const totalIncomes = incomeData.reduce((acc, current) => acc + parseFloat(current.amount.replace('$', '').replace(',' , '')), 0);
      
        const balance = totalIncomes - totalExpenses;
        return parseFloat(balance.toFixed(2))

}
         
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
    const balance = getBalance(finances)
      
    return (
        <>  
            <div >
            <Text h2>Main  Feed <span style ={{margin:' 0 220px'}}>${getBalance(finances).toFixed(2) } </span> </Text>
           
            </div>
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