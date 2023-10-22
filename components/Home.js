import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from "react";
import { Keyboard, Pressable, Text, TextInput, View } from "react-native";
import { BONUS_POINTS, BONUS_POINTS_LIMIT, MAX_SPOT, MIN_SPOT, NBR_OF_DICES, NBR_OF_THROWS } from '../constants/Game';
import Styles from '../style/Styles';
import Footer from "./Footer";
import Header from "./Header";

const Home = ({ navigation }) => {

    const [playerName, setPlayerName] = useState('');
    const [hasPlayerName, setHasPlayerName] = useState(false);

    const handlePlayerName = (value) => {
        if (value.trim().length > 0) {
            setHasPlayerName(true);
            Keyboard.dismiss();
        }
    }

    return (
        <>
            <Header />
            <View style={Styles.view}>
                <MaterialCommunityIcons name="information" size={90} color="steelblue" />
                {!hasPlayerName ?
                    <>
                        <Text>For scoreboard enter your name...</Text>
                        <TextInput onChangeText={setPlayerName} autoFocus={true} />
                        <Pressable
                            onPress={() => handlePlayerName(playerName)}>
                            <Text>OK</Text>
                        </Pressable>
                    </>
                    :
                    <>
                        <Text multiline="true">
                            THE GAME: Upper section of the classic Yahtzee
                            dice game. You have {NBR_OF_DICES} dices and
                            for the every dice you have {NBR_OF_THROWS} throws.
                            After each throw you can keep dices in
                            order to get same dice spot counts as many as
                            possible. In the end of the turn you must select
                            your points from {MIN_SPOT} to {MAX_SPOT}.
                            Game ends when all points have been selected.
                            The order for selecting those is free.
                        </Text>
                        <Text multiline="true">POINTS: After each turn game calculates the sum
                            for the dices you selected. Only the dices having
                            the same spot count are calculated. Inside the
                            game you can not select same points from
                            {MIN_SPOT} to {MAX_SPOT} again.</Text>
                        <Text multiline="true">GOAL: To get points as much as possible.
                            {BONUS_POINTS_LIMIT} points is the limit of
                            getting bonus which gives you {BONUS_POINTS} points more.</Text>
                        <Text>Good luck, {playerName}</Text>
                        <Pressable
                            onPress={() => navigation.navigate('Gameboard', { player: playerName })}>
                            <Text>PLAY</Text>
                        </Pressable>
                    </>
                }
            </View>
            <Footer />
        </>
    )

}

export default Home;
