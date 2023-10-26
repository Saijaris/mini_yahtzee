import { StyleSheet } from 'react-native';

export const pink = 'rgb(227, 26, 123)';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        marginTop: 30,
        marginBottom: 15,
        backgroundColor: pink,
        flexDirection: 'row',
    },
    footer: {
        marginTop: 20,
        backgroundColor: pink,
        flexDirection: 'row'

    },
    title: {
        color: '#fff',
        fontWeight: 'bold',
        flex: 1,
        fontSize: 23,
        textAlign: 'center',
        margin: 10,
    },
    author: {
        color: '#fff',
        fontWeight: 'bold',
        flex: 1,
        fontSize: 15,
        textAlign: 'center',
        margin: 10,
    },
    gameboard: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    gameinfo: {
        backgroundColor: '#fff',
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 20,
        marginTop: 10
    },
    row: {
        marginTop: 20,
        padding: 10
    },
    flex: {
        flexDirection: "row"
    },
    view: {
        padding: 10,
        alignItems: 'center',
        flexGrow: 1
    },
    icons: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    bigText: {
        fontSize: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        padding: 10,
        margin: 10
    },
    button: {
        marginTop: 10,
        backgroundColor: pink,
        borderRadius: 5,
        color: '#ffffff'
    },
});