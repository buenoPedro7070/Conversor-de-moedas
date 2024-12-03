import { Button } from "@/components/Button"
import { useEffect, useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import { router } from "expo-router"
import { useOAuth } from "@clerk/clerk-expo"
import * as Liking from "expo-linking"
import * as WebBrowser from 'expo-web-browser';



export default function SignIn() {

    const [isLoading, setIsLoading] = useState(false)
    const googleOAuth = useOAuth({ strategy: "oauth_google" })

    async function onGoogleSignIn() {
        try {
            setIsLoading(true)

            const redirectUrl = Liking.createURL("/")
            const oAuthFlow = await googleOAuth.startOAuthFlow({redirectUrl})
            if (oAuthFlow.authSessionResult?.type === "success") {
                if (oAuthFlow.setActive) {
                    await oAuthFlow.setActive({ session: oAuthFlow.createdSessionId })
                }
            }
            else{
                setIsLoading(false)
            }
        }
        catch (error) {
            console.log(error)
            setIsLoading(false)
        }
    }
    /*useEffect(() => {
        WebBrowser.warmUpAsync()
        return () => { WebBrowser.coolDownAsync() }
    }, [])*/

    return (
        <View style={style.tela}>
            <Text style={style.texto}>
                CONVERSOR DE MOEDAS
            </Text>
            <Button
                icon="logo-google"
                title="GOOGLE"
                onPress={onGoogleSignIn}
                isLoading={isLoading}
            />


        </View>
    )
}
const style = StyleSheet.create({

    tela: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,

    },
    texto: {
        fontSize: 27,
        fontWeight: '700',
        paddingBottom: 20,
    },
})