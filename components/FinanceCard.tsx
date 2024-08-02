import { NextPage } from "next";
import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import {Card, Text } from "@nextui-org/react"


interface Props{
    finance: any
}
const FinanceCard: NextPage<Props> = (props) =>{
    const router = useRouter();
    const { finance} = props;
    //inserted at date string
    //console.log(inserted at)

    function getDate(){
        // dd--mm--yyy
        let time = Date.parse(finance.inserted_at);
        let date = new Date (time);


        return date.getDay() + "-" + date.getMonth() + "-" + date.getFullYear();
    }





    return(
        <Card
        isPressable
        css = {{mb: "$10"}}
        onPress= {() =>router.push("/finance?id=" + finance.id)}
        >
        <Card.Body>
            <Text h4 css = {{textAlign:'right'}}>{finance.amount}</Text>

            <Text h2>{finance.transaction}</Text>
            
               
            <Text b>posted</Text>
            <Text b>By {finance.user_email.toLowerCase ()}</Text>
        </Card.Body>
        </Card>
    )

}

export default FinanceCard



