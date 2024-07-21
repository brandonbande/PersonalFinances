import { NextPage } from "next";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Text, Textarea, Grid, Button } from "@nextui-org/react";
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

  const handleChange = (e: any) => {
    setFinanceData({ ...financeData, [e.target.name]: e.target.value });
  };

  const recordFinances = async () => {
    try {
      const { data, error } = await supabaseClient
        .from("personalfinance")
        .insert([
          {
            transaction_date: financeData.transaction_date,
            transaction: financeData.transaction,
            category: financeData.category,
            amount: financeData.amount,
            account_balance: financeData.account_balance,
            user_email: user?.email?.toLowerCase(),
            user_id: user?.id,
          },
        ])
        .single();
      if (error) throw error;
      setFinanceData(initialState);
      router.push("/mainFeed");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const fetchTransactions = async () => {
    const { data, error } = await supabaseClient
      .from("personalfinance")
      .select("amount,category");
    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      //filter expenses and incomes
      const expenses = data.filter((transaction) => transaction.category === "expenses");
      const incomes = data.filter((transaction) => transaction.category === "incomes");
      // Calculate total expenses and map amounts
      // Calculate total incomes and map amounts
      const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
      const totalIncomes = incomes.reduce((total, income) => total + income.amount, 0);

      const balance = totalIncomes - totalExpenses;

      console.log(`Account_balance: ${balance}`);
    }
  };

  const accountBalance = (payload: any) => {
    const { new: newTransaction } = payload;
    setFinanceData((prevData) => ({
      ...prevData,
      account_balance: (parseFloat(prevData.account_balance) + parseFloat(newTransaction.amount)).toString(),
    }));
    return (parseFloat(financeData.account_balance) + parseFloat(newTransaction.amount)).toString();
  };

  useEffect(() => {
    const channel = supabaseClient
      .channel('personalfinance')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'personalfinance' }, (payload) => {
        const newBalance = accountBalance(payload);
        if (document.getElementById("account-balance")) {
          document.getElementById("account-balance")!.innerHTML = newBalance;
        }
      })
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, []);

  console.log(financeData);

  return (
    <Grid.Container>
      <Text h3>Transaction-date</Text>
      <Grid xs={12}>
        <Textarea
          name="transaction_date"
          aria-label="transaction_date"
          placeholder="Transaction-date"
          fullWidth
          rows={1}
          size="xl"
          onChange={handleChange}
          
          
        />
      </Grid>
      <Text h3>Transaction</Text>
      <Grid xs={12}>
        <Textarea
          name="transaction"
          aria-label="transaction"
          placeholder="enter the transaction"
          fullWidth
          rows={2}
          size="xl"
          onChange={handleChange}
          
        />
      </Grid>
      <Text h3>Category</Text>
      <Grid xs={12}>
        <Textarea
          name="category"
          aria-label="category"
          placeholder="Either expenses or incomes"
          fullWidth
          rows={2}
          size="xl"
          onChange={handleChange}
        />
      </Grid>
      <Text h3>Amount</Text>
      <Grid xs={12}>
        <Textarea
          name="amount"
          aria-label="amount"
          placeholder="enter amount"
          fullWidth
          rows={1}
          size="xl"
          onChange={handleChange}
        />
      </Grid>
      <Text h3 id="account-balance">Account-balance</Text>
      <Grid xs={12}>
        <Textarea
          name="account_balance"
          aria-label="account_balance"
          placeholder="Account-balance"
          fullWidth
          rows={1}
          size="xl"
          onChange={handleChange}
        />
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
