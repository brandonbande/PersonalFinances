import { NextPage } from "next";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Text, Textarea, Grid, Button, Input } from "@nextui-org/react";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";
import { useState, ChangeEvent, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseClient = createClient(supabaseUrl, supabaseKey);



const RecordFinances: NextPage = () => {
  const user = useUser();
  const router = useRouter();

  const initialState = {
    transaction_date: "",
    transaction: "",
    category: "",
    amount: "",
    account_balance: "",
  };
  
  
   const [financeData, setFinanceData] = useState(initialState);
   const [error, setError] = useState<any>(null)
   const [transactionsData, setTransactionsData] = useState <any>([]); // keep track of data from supabase 
   let balance = getBalance(transactionsData)
   balance = parseFloat(balance.toFixed(2))
  const handleChange = (e: any) => {
    setFinanceData({ ...financeData, [e.target.name]: e.target.value });
  };

  const recordFinances = async () => {
    
    setError(null)
    let amount =parseFloat(financeData.amount)
    let category = financeData.category
    if (category === "" || category === null) {
      setError('Category cannot be null')
      return
    }
    

    try {
     
   
      if ( (category === 'expenses' && amount <= balance)   || category === 'incomes' ){



        const { data, error } = await supabaseClient
         
        .from("personalfinance")
        .insert([
          {
            account_balance:  category === 'expenses' ? balance-amount   : balance + amount, //paukusenda data ku supabase
            transaction_date: financeData.transaction_date,
            transaction: financeData.transaction,
            category: category,
            amount: amount,
            user_email: user?.email?.toLowerCase(),
            user_id: user?.id,
          },
        ])
        .single();
      if (error) throw error;
      setFinanceData(initialState);
      console.log("pushing to mainFeed")
      router.push("/mainFeed");
      }else{
        setError('Insuffient funds')
        console.log(error)
        return
      }
      
      
    } catch (error: any) {
      alert(error.message);
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabaseClient
      .from("personalfinance")
      .select("amount,category");
    if (error) {
      console.error(error);
      return;
    } setTransactionsData(data)
     // console.log(data)
    } catch (error) {
      console.log(error)
      
    }

  

  };



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
  fetchTransactions();
}, []);
 

 // console.log(financeData);

  return (
    <Grid.Container>
      { error && <Grid xs={10}>

        <h3>
        {error}
        </h3>


      </Grid>}
      <Text className="mt-10" h3>Transaction Date</Text>
      <Grid xs={12}>
        <input
          name="transaction_date"
          type="date"
          onChange={handleChange}  
        />
      </Grid>
      <Text h3>Transaction</Text>
      <Grid xs={12}>
        
      <Textarea
       
          name="transaction"
          aria-label="transaction"
          placeholder="Enter the transaction "
          fullWidth
          rows={1}
          size="xl"
          onChange={handleChange}
       />   
      </Grid>
      <Text h3>Category</Text>
      <Grid xs={12}>
      
     
      
        <select  name="category" onChange={handleChange}>
          <option></option>
          <option value="expenses">Expenses</option>
          <option value="incomes">Incomes</option>
          
        </select>
         
          
     
      
      </Grid>
      <Text h3>Amount</Text>
      <Grid xs={12}>
        <Textarea
          name="amount"
          aria-label="amount"
          placeholder="Enter amount"
          fullWidth
          rows={1}
          size="xl"
          onChange={handleChange}
        />
      </Grid>
      <Text h3 id="Account Balance">Account Balance</Text>
      <Grid xs={12}>
      <h2 className="text-3xl">
            
           ${
              
              balance.toFixed(2)
            }


      </h2>
        
      </Grid>
      <Grid xs={12}>
        <Text>Posting as {user?.email}</Text>
      </Grid>
      <Button onPress={recordFinances}>Create Finance</Button>
    </Grid.Container>
  );
};

export default RecordFinances;
export const getServerSideProps = withPageAuth({ redirectTo: "/login" });
