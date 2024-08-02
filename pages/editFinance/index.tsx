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
    
    const handleChange = (e: any) =>{
            setFinanceData({...financeData, [e.target.name] : e.target.value })

    }

    useEffect( () => {
        async function getFinance() {
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
            getFinance();
        }
    }, [id])
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




    console.log(financeData);
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
       <Text h3>Account-balance</Text>
       <Grid xs ={12}>
        <Textarea
          name="account_balance"
          aria-label="account-balance"
          placeholder="Account-balance"
          fullWidth={true}
          rows={1}
          size="xl"
          onChange={handleChange}
          initialValue={financeData.account_balance}
      
        
        
        />
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