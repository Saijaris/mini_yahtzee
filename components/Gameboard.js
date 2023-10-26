import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Col, Container, Row } from 'react-native-flex-grid';
import { Button } from "react-native-paper";
import { BONUS_POINTS, BONUS_POINTS_LIMIT, MAX_SPOT, NBR_OF_DICES, NBR_OF_THROWS, SCOREBOARD_KEY } from '../constants/Game';
import Styles, { pink } from "../style/Styles";
import Footer from "./Footer";
import Header from "./Header";

let board = [];
const initialSelectedDices = new Array(NBR_OF_DICES).fill(false);
const initialSelectedDicePoints = new Array(MAX_SPOT).fill(false);
const initialDiceSpots = new Array(NBR_OF_DICES).fill(0);
const initialDicePointsTotal = new Array(MAX_SPOT).fill(0);
const initialStatus = 'Throw dices';

const Gameboard = ({ navigation, route }) => {

    const [playerName, setPlayerName] = useState('');
    const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [status, setStatus] = useState(initialStatus);
    const [gameEndStatus, setGameEndStatus] = useState(false);
    const [roundEndStatus, setRoundEndStatus] = useState(false);
    //Mitkä nopat ovat valittu
    const [selectedDices, setSelectedDices] = useState(initialSelectedDices);
    //Noppien silmäluvut
    const [diceSpots, setDiceSpots] = useState(initialDiceSpots);
    //Onko silmäluvulle valittu pisteet
    const [selectedDicePoints, setSelectedDicePoints] = useState(initialSelectedDicePoints);
    //Kerätyt pisteet
    const [dicePointsTotal, setDicePointsTotal] = useState(initialDicePointsTotal);
    const diceMultiple = <MaterialCommunityIcons
        name={"dice-multiple"}
        size={50}
        color={pink}>
    </MaterialCommunityIcons>
    const totalDicePoints = dicePointsTotal.reduce((total, x) => total + x, 0);
    const totalScores = totalDicePoints >= BONUS_POINTS_LIMIT ? totalDicePoints + BONUS_POINTS : totalDicePoints;
    const pointsFromBonus = totalScores < BONUS_POINTS_LIMIT ? BONUS_POINTS_LIMIT - totalScores : 0;

    useEffect(() => {
        if (playerName === '' && route.params?.player) {
            setPlayerName(route.params.player);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getScoreboardData();
        });
        return unsubscribe;
    }, [navigation]);

    const dicesRow = [];
    for (let dice = 0; dice < NBR_OF_DICES; dice++) {
        dicesRow.push(
            <Col key={"dice" + dice}>
                <Pressable
                    key={"dice" + dice}
                    onPress={() => selectDice(dice)}>
                    <MaterialCommunityIcons
                        name={board[dice]}
                        key={"dice" + dice}
                        size={50}
                        color={getDiceColor(dice)}>
                    </MaterialCommunityIcons>
                </Pressable>
            </Col>
        );
    }

    const pointsRow = [];
    for (let spot = 0; spot < MAX_SPOT; spot++) {
        pointsRow.push(
            <Col key={"pointsRow" + spot}>
                <Text key={"pointsRow" + spot}>{getSpotTotal(spot)}
                </Text>
            </Col>
        );
    }

    const pointsToSelectRow = [];
    for (let diceButton = 0; diceButton < MAX_SPOT; diceButton++) {
        pointsToSelectRow.push(
            <Col key={"buttonsRow" + diceButton}>
                <Pressable
                    key={"buttonsRow" + diceButton}
                    onPress={() => selectDicePoints(diceButton)}>
                    <MaterialCommunityIcons
                        name={"numeric-" + (diceButton + 1) + "-circle"}
                        key={"buttonsRow" + diceButton}
                        size={35}
                        color={getDicePointsColor(diceButton)}>
                    </MaterialCommunityIcons>
                </Pressable>
            </Col>
        );
    }

    const selectDicePoints = (i) => {
        if (nbrOfThrowsLeft === 0) {
            let selectedPoints = [...selectedDicePoints];
            let points = [...dicePointsTotal];
            if (!selectedPoints[i]) {
                selectedPoints[i] = true;
                let nbrOfDices = diceSpots.reduce((total, x) => (x === (i + 1) ? total + 1 : total), 0);
                points[i] = nbrOfDices * (i + 1);
            }
            else {
                setStatus('You already selected points for ' + (i + 1));
                return points[i];
            }
            setDicePointsTotal(points);
            setSelectedDicePoints(selectedPoints);
            setRoundEndStatus(true);
            setNbrOfThrowsLeft(NBR_OF_THROWS);
            setSelectedDices(initialSelectedDices);
            if (selectedPoints.every(value => value)) {
                setGameEndStatus(true);
                return;
            }
            return points[i];
        }
        else {
            setStatus('Throw ' + NBR_OF_THROWS + ' times before setting points');
        }
    }

    const savePlayerPoints = async () => {
        const scores = await getScoreboardData();
        const t = new Date();
        const playerPoints = {
            key: playerName + '-' + t.getTime(),
            name: playerName,
            date: t.toLocaleDateString(),
            time: t.toLocaleTimeString(),
            points: totalScores,
        }

        try {
            const newScore = [...scores, playerPoints];
            const jsonValue = JSON.stringify(newScore);
            await AsyncStorage.setItem(SCOREBOARD_KEY, jsonValue);
        }
        catch (e) {
            console.log('Save error: ' + e);
        }
    }

    const getScoreboardData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY);
            if (jsonValue !== null) {
                let tmpScores = JSON.parse(jsonValue);
                return tmpScores ? tmpScores : []
            }
            return []
        }
        catch (e) {
            console.log('Read error: ' + e);
        }
    }

    const throwDices = () => {
        if (nbrOfThrowsLeft === 0 && !roundEndStatus) {
            setStatus('Select your points before the next throw');
            return 1;
        }
        else if (nbrOfThrowsLeft === 0 && gameEndStatus) {
            setGameEndStatus(false);
            diceSpots.fill(0);
            dicePointsTotal.fill(0);
        }
        let spots = [...diceSpots];
        for (let i = 0; i < NBR_OF_DICES; i++) {
            if (!selectedDices[i]) {
                let randomNumber = Math.floor(Math.random() * 6 + 1);
                board[i] = 'dice-' + randomNumber;
                spots[i] = randomNumber;
            }
        }
        setNbrOfThrowsLeft(prev => prev - 1);
        setDiceSpots(spots);
        setStatus('Select and throw dices again');
        setRoundEndStatus(false);
    }

    function getSpotTotal(i) {
        return dicePointsTotal[i];
    }

    const selectDice = (i) => {
        if (nbrOfThrowsLeft < NBR_OF_THROWS && !gameEndStatus) {
            let dices = [...selectedDices];
            dices[i] = selectedDices[i] ? false : true;
            setSelectedDices(dices);
        }
        else {
            setStatus('You have to throw first.');
        }
    }

    function getDiceColor(i) {
        return selectedDices[i] ? "black" : pink;
    }

    function getDicePointsColor(i) {
        return selectedDicePoints[i] && !gameEndStatus ? "black" : pink;
    }

    const reset = () => {
        setSelectedDices(initialSelectedDices);
        setSelectedDicePoints(initialSelectedDicePoints);
        setDiceSpots(initialDiceSpots);
        setDicePointsTotal(initialDicePointsTotal);
        setStatus(initialStatus);
        setNbrOfThrowsLeft(NBR_OF_THROWS);
        setGameEndStatus(false);
        setRoundEndStatus(false);
    }

    return (
        <>
            <Header />
            <View style={Styles.view}>
                <Container fluid>
                    {gameEndStatus ? <><Row style={Styles.icons}><Text>GAME OVER</Text></Row>
                        <Row style={Styles.icons}><Button style={Styles.button} textColor='#ffffff' onPress={reset}>NEW GAME</Button></Row></>
                        : <Row style={Styles.icons}>{nbrOfThrowsLeft === 3 ? diceMultiple : dicesRow}</Row>}
                </Container>
                <Text>Throws left: {nbrOfThrowsLeft}</Text>
                <Text>{status}</Text>
                <Button style={Styles.button} textColor='#ffffff'
                    onPress={() => throwDices()}>THROW DICES</Button>
                <Container fluid>
                    <Row><Text>Total: {totalScores}</Text></Row>
                    <Row>{totalScores < BONUS_POINTS_LIMIT ? <Text>You are {pointsFromBonus} points away from bonus</Text>
                        : <Text>Congrats! Bonus points ({BONUS_POINTS}) added</Text>}</Row>
                    <Row>{pointsRow}</Row>
                </Container>
                <Container fluid>
                    <Row>{pointsToSelectRow}</Row>
                </Container>
                <Button style={Styles.button} textColor='#ffffff' onPress={() => savePlayerPoints()}>SAVE POINTS</Button>
                <Text>Player: {playerName}</Text>
            </View>
            <Footer />
        </>
    )
}

export default Gameboard;