//@ts-ignore
import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { Text, Spacer } from "@nextui-org/react";
// localhost:3000
const Home: NextPage = () => {
  return (
    <>
   
        
   
     
     
      <Text h2 size="$5xl">The future of expense and income tracking</Text>
      <Spacer y={1} />
      <Text h2 size="$5xl">
        Personal Finance tracker allows you to record your incomes and expenses
      </Text>
      
    </>
  )
}

export default Home
