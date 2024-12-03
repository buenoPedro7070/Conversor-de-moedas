import { StyleSheet } from "react-native";

export const MeuEstilo = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: 'row',
        backgroundColor: '#000',
        alignItems: 'center',
        padding: 22,
        borderRadius: 16,
        gap: 7,
        justifyContent: 'center',
    },
    icon:{
        width: 20,
        height: 20,
    },
    text:{
        left: -4,
        color:'#fff',
        fontSize: 24,
        fontWeight: '900',
        letterSpacing: 4,
    }
})