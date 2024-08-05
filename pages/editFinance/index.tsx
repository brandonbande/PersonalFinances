import type { NextPage } from "next";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Text, Textarea, Grid, Button} from "@nextui-org/react"
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { useState, useEffect} from "react";

const editFinance:NextPage = () => {
    const supabaseClient = useSupabaseClient();
    const user = useUser();
    const router = useRouter();
    const {id} = router.query;
        
    const initialState = {
        transaction_date:"",
        transaction:"",
        category:"",
        amount:"",
        account_balance:""
    }
    const [financeData, setFinanceData] = useState (initialState);
    const [transactionsData, setTransactionsData] = useState <any>([]); // keep track of data from supabase 
    const balance = getBalance(transactionsData) 
    
    const handleChange = (e: any) =>{
            setFinanceData({...financeData, [e.target.name] : e.target.value })

    }
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
    
        async function fetchTransactions() {
            const {data, error} = await supabaseClient
                .from("personalfinance")
                .select("*")
                .filter("id", "eq", id)
                .single();
            if (error) {
                console.log(error);
            } else {
                setFinanceData(data);
            }
        }
        if(typeof id !== "undefined") {
           fetchTransactions
         }; [id]
    const editFinance = async () =>{
       try {
        const { data, error} = await supabaseClient
            .from ("personalfinance")
            .update([
                {
                     transaction_date: financeData.transaction_date,
                     transaction: financeData.transaction,
                     category: financeData.category,
                     amount: financeData.amount,
                     account_balance: financeData.account_balance,
                    

                }
            ])
            .eq("id" , id)
            if (error) throw error;
            
            router.push("/finance?id=" + id);

       }catch (error:any){
        alert(error.message);
       }

    }

    useEffect( () => {
      fetchTransactions }
      ,[])

   // console.log(financeData);

    
return(
      <Grid.Container>
   
      <Text className="mt-10" h3>Transaction Date</Text>
      <Grid xs={12}>
        <input
          name="transaction_date"
          type="date"
          onChange={handleChange}
          value={financeData.transaction_date}
        
        />
       </Grid>
       <Text h3>Transaction</Text>
       <Grid xs ={12}>
        <Textarea
          name="transaction"
          aria-label="transaction"
          placeholder="Enter the transaction"
          fullWidth={true}
          rows={2}
          size="xl"
          onChange={handleChange}
          initialValue={financeData.transaction}
        
        
        />
       </Grid>
       <Text h3  >Category</Text>
       <Grid xs ={12}>
        
       <select  name="category" onChange={handleChange} value={financeData.category}>
          <option></option>
          <option value="expenses">Expenses</option>
          <option value="incomes">Incomes</option>
          
        </select>
         
       
       
        
        
        </Grid>
       <Text h3>Amount</Text>
       <Grid xs ={12}>
        <Textarea
          name="amount"
          aria-label="amount"
          placeholder="enter amount"
          fullWidth={true}
          
          rows={1}
          size="xl"
          onChange={handleChange}
          initialValue={financeData.amount}

        
        
        />
       </Grid>
       <Text h3 id="Account Balance">Account Balance</Text>
      <Grid xs={12}>
      <h2 className="text-3xl">
            
          
          
              
              ${getBalance(transactionsData).toFixed(2) }
            
  
      </h2>
        
      </Grid>
        
        
       
       <Grid xs={12}>
           <Text>
          Editing as {user?.email}
           </Text>

       </Grid>
       <Button onPress={editFinance}>Update Finance</Button>
       

      </Grid.Container>
)

}
export default editFinance;
export const getServerSideProps = withPageAuth({ redirectTo: "/login"});

