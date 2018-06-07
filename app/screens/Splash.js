import React,{Component} from 'react';
import { View,Text, KeyboardAvoidingView,Picker, Image } from 'react-native';
import { FormLabel, FormInput, Button, Icon } from 'react-native-elements'
import Modal from "react-native-modal";
import axios from 'axios';
import Location from '../util/Location';


let position = new Location();

export default class Splash extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: [],
            origem: '',
            destino: '',
            distancia: '',
            tempo: '',
            erro: '',
            inputLatitudeValue: '',
            inputLongitudeValue: '',
            latitude: null,
            longitude: null,
            isVisible: false,
        }
        this._setCurrentLocation = this._setCurrentLocation.bind(this);
        this._makeGetToMatrixAPI = this._makeGetToMatrixAPI.bind(this);
        this._handleLatitudeValue = this._handleLatitudeValue.bind(this);
        this._handleLongitudeValue = this._handleLongitudeValue.bind(this);
        this._showModal = this._showModal.bind(this);
        this._hiddenModal = this._hiddenModal.bind(this);
    }

    componentWillMount(){
        this._setCurrentLocation();
    }

    _handleLatitudeValue = (e) => {
        this.setState({inputLatitudeValue:e});
    }

    _handleLongitudeValue = (e) => {
        this.setState({inputLongitudeValue:e});
    }

    _setCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => console.log(error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
        );
    }

    _showModal = () => {
        this.setState({isVisible: true,})
    }

    _hiddenModal = () => {
        this.setState({isVisible: false,})
    }


    _makeGetToMatrixAPI = () => {
        const {latitude,longitude,inputLatitudeValue, inputLongitudeValue} = this.state;
        const uri = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=40.6655101,-73.89188969999998&destinations=40.6905615%2C-73.9976592&key=AIzaSyBFuewXNO2PKsVBRj6KFapeSU9XUc8ARg0';
            //      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${latitude},${longitude}&destinations=${inputLatitudeValue},${inputLongitudeValue}&key=AIzaSyC4B7FfR6nV1P2YDuqvuyxWyspxUCtuem8`;
        axios.get(uri)
            .then( response => {

                this.setState({
                    data:response.data,
                    origem: response.data.origin_addresses,
                    destino: response.data.destination_addresses,
                    distancia: response.data.rows[0].elements[0].distance.text,
                    tempo:response.data.rows[0].elements[0].duration.text,
                })
            })
            .catch( err => this.setState({
                erro: err.toString(),
            }) )
        this._showModal();
    }

    render(){
        return(
            <View>
                <KeyboardAvoidingView
                    behavior="padding"
                    style={style.root}
                >
                    <View style={{backgroundColor:'white', height:26, margin:0}}/>
                    <View style={style.container}>
                        <View style={{flex:1, marginTop:5, alignItems:"center", justifyContent:'center'}}>
                            <Text style={style.title}>Google Maps Distance Matrix API</Text>
                        </View>
                        <View style={{borderRadius:5,borderColor:'red'}}>
                            <FormLabel >Latitude:</FormLabel>
                            <FormInput  inputStyle={style.input}
                                        onChangeText={this._handleLatitudeValue}
                                        value={this.state.inputLatitudeValue}/>

                            <FormLabel >Longitude:</FormLabel>
                            <FormInput  inputStyle={style.input}
                                        onChangeText={this._handleLongitudeValue}
                                        value={this.state.inputLongitudeValue}/>

                            <FormLabel >Meio de Transporte:</FormLabel>
                            <Picker>
                                <Picker.Item label = "Carro" value = "carro" />
                                <Picker.Item label = "Onibus" value = "onibus" />
                                <Picker.Item label = "Á Pé" value = "ape" />
                            </Picker>

                            <FormLabel >Hora de Partida:</FormLabel>
                            <FormInput  inputStyle={style.input}/>


                        </View>
                        <View style={style.buttonContainer}>
                            <Button
                                onPress={() => this._makeGetToMatrixAPI()}
                                buttonStyle={style.button}
                                title='Pesquisar' />
                        </View>
                    </View>

                    <Modal isVisible={this.state.isVisible} style={style.modalContainer}>
                        <View style={style.modal}>

                            <View style={{ marginTop:5}}>
                                <Text style={style.textModal}>{`Origem: ${this.state.origem}`}</Text>
                            </View>
                            <View style={{ marginTop:5}}>
                                <Text style={style.textModal}>{`Destino: ${this.state.destino}`}</Text>
                            </View>
                            <View style={{ marginTop:5}}>
                                <Text style={style.textModal}>{`Distancia: ${this.state.distancia}`}</Text>
                            </View>
                            <View style={{ marginTop:5}}>
                                <Text style={style.textModal}>{`Tempo de Percurso: ${this.state.tempo}`}</Text>
                            </View>
                            <View style={{ marginTop:5}}>
                                <Text style={style.textModal}>{`${this.state.erro}`}</Text>
                            </View>

                            <View style={style.buttonContainer}>
                                <Button
                                    onPress={() => this._hiddenModal()}
                                    buttonStyle={style.button}
                                    title='Voltar' />
                            </View>
                        </View>
                    </Modal>

                </KeyboardAvoidingView>
            </View>
        );
    }
}
//<Text style={style.textModal}>{`Distancia: ${this.state.data.rows[0].elements[0].distance.text}`}</Text>

const style = {
    root:{
        flex: 1,
        flexDirection: 'column',
    },
    container: {
        flex:1,
        justifyContent:'center'
    },
    buttonContainer:{
        marginTop:15,
        marginBottom:15,
    },
    button:{
        width:'100%',
        backgroundColor:'navy',
        alignSelf:'center',
        marginHorizontal:0,
    },
    title: {
        textAlign: 'center',
        fontSize: 30,
        marginBottom: 40,
        color: '#BEBEBE'
    },
    input:{
        backgroundColor:'#FFF',
    },
    modal: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 4,
    },
    textModal: {
        textAlign: 'center',
        fontSize: 20,
        marginHorizontal:16,
        marginTop: 16,
    },
    iconClose:{
        alignItems:'flex-start',
    },
    modalContainer: {
        flex:1,

    }

}