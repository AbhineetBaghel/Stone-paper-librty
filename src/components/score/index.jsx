import { Flex, Typography } from "../../style";


export const Score = ({ userName, scorePlayer, scoreComputer }) => {

    userName = userName.length > 12 ? `${userName.slice(0, 8)}... ` : userName;


    return (
        <Flex direction='column'>
            <Typography size='32px' fontWeight='400' lineHeight='48px'>SCORE</Typography>

            <Flex justify='space-between'>
                <Flex direction='column' gap='2px'>
                    <Typography>{userName}</Typography>
                    <Typography>{scorePlayer}</Typography>
                </Flex>
                <Flex direction='column' gap='2px'>
                    <Typography>COMPUTER</Typography>
                    <Typography>{scoreComputer}</Typography>
                </Flex>
            </Flex>
        </Flex>

    )
}