/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import AudioPlayer from 'react-native-play-audio';

//console.log(AudioPlayer)

export default class App extends Component {

    componentDidMount() {
        // AudioPlayer.onEnd(() => {
        //     console.log('on end');
        // });

        AudioPlayer.onEnd(() => {
            console.log('on end');
        });

        const URL = 'https://cdn.jicki.zwei.biz/audio/tour/sample-griechisch-urlaub.mp3';

        const callback = () => {
            AudioPlayer.play();

            AudioPlayer.getDuration((duration) => {
                console.log(duration);
            });
            setInterval(() => {
                AudioPlayer.getCurrentTime((currentTime) => {
                    console.log(currentTime);
                });
            }, 1000);
        }

        AudioPlayer.prepare(URL, callback);
        //  AudioPlayer.prepareWithFile('sample-griechisch-urlaub', 'mp3', callback);

        // AudioPlayer.stop();
        // AudioPlayer.pause();
        // AudioPlayer.setTime(50.5);
        // const url = 'https://cdn.jicki.zwei.biz/audio/tour/sample-griechisch-urlaub.mp3';
        // AudioPlayer.prepare(url, () => {
        //     AudioPlayer.play();

        //     AudioPlayer.getDuration((duration) => {
        //         console.log(duration);
        //     });
        //     setInterval(() => {
        //         AudioPlayer.getCurrentTime((currentTime) => {
        //             console.log(currentTime);
        //         });
        //     }, 1000);
        //     AudioPlayer.prepare(URL, callback);
        //     AudioPlayer.prepareWithFile('sample-griechisch-urlaub', 'mp3', callback);
        // AudioPlayer.stop();
        //AudioPlayer.pause();
        //AudioPlayer.setCurrentTime(50.5);
        // })
        // const isSetup = await AudioPlayer.setup({ some: "bull" })

        // console.log(isSetup, `isSetup`)
        //AudioPlayer.play('https://cdn.jicki.zwei.biz/audio/tour/sample-griechisch-urlaub.mp3');
        // setTimeout(async () => {
        //     const data = await AudioPlayer.add({
        //         title: 'Living on a Prayer',
        //         description: 'A song by some dudes with crazy hair in the late 80s',
        //         uri: 'https://cdn.jicki.zwei.biz/audio/tour/sample-griechisch-urlaub.mp3',
        //         artwork: 'https://cdn.jicki.zwei.biz/image/deutsch.jpg',
        //     })

        //     console.log(data)
        // }, 2000);

        // setTimeout(async () => {
        //     const data = await AudioPlayer.hideNotification()

        //     console.log(data)
        // }, 10000);

    }

    render() {
        return (
            <View style={ styles.container }>
                <Text style={ styles.welcome }>Welcome to React Native Audio Player</Text>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
