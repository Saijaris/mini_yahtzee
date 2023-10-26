import { Text, View } from "react-native";
import Footer from "./Footer";
import Header from "./Header";
//import Styles from "../style/Styles"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Container, Row } from "react-native-flex-grid";
import { Button, DataTable } from "react-native-paper";
import { NBR_OF_SCOREBOARD_ROWS, SCOREBOARD_KEY } from "../constants/Game";
import Styles from "../style/Styles";

const emoticonHappyOutline = <MaterialCommunityIcons
    name={"emoticon-happy-outline"}
    size={50}
    color="rgb(227, 26, 123)">
</MaterialCommunityIcons>

const Scoreboard = ({ navigation }) => {
    const [scores, setScores] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getScoreboardData();
        });
        return unsubscribe;
    }, [navigation]);

    const sortScore = (a, b) => a.points < b.points ? 1 : a.points > b.points ? -1 : 0;

    const getScoreboardData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY);
            if (jsonValue !== null) {
                let tmpScores = JSON.parse(jsonValue);
                setScores(tmpScores ? tmpScores.sort(sortScore) : []);
                return;
            }
            setScores([])
        }
        catch (e) {
            console.log('Read error: ' + e);
        }
    }

    const clearScoreboard = async () => {
        try {
            await AsyncStorage.clear();
            setScores([]);
        }
        catch (e) {
            console.log('Clear error: ' + e);
        }
    }

    return (
        <>
            <Header />
            <View style={Styles.view}>
                <Row style={Styles.icons}>{emoticonHappyOutline}</Row>
                <Row style={Styles.icons}><Text style={Styles.bigText}>Top Seven</Text></Row>
                <Container fluid>
                    {scores.length === 0 ?
                        <Text style={Styles.text}>Scoreboard is empty</Text>
                        :
                        scores.filter((player, index) =>
                            index < NBR_OF_SCOREBOARD_ROWS
                        )
                            .map((player, index) => (
                                <DataTable.Row key={player.key}>
                                    <DataTable.Cell><Text>{index + 1}.</Text></DataTable.Cell>
                                    <DataTable.Cell><Text>{player.name}</Text></DataTable.Cell>
                                    <DataTable.Cell><Text>{player.date}</Text></DataTable.Cell>
                                    <DataTable.Cell><Text>{player.time}</Text></DataTable.Cell>
                                    <DataTable.Cell><Text>{player.points}</Text></DataTable.Cell>
                                </DataTable.Row>
                            ))
                    }
                </Container>
                <View>
                    <Row style={Styles.icons}>
                        <Button style={Styles.button} textColor='#ffffff'
                            onPress={() => clearScoreboard()}>CLEAR SCOREBOARD</Button>
                    </Row>
                </View>
            </View>
            <Footer />
        </>
    )
}

export default Scoreboard;