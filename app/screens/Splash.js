import React,{Component} from 'react';
import { View, ScrollView,Text, KeyboardAvoidingView,Picker, Image } from 'react-native';
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
            inputOrigemValue: '40.6655101,-73.89188969999998',
            inputDestinoValue: '40.6905615,-73.9976592',
            inputHoraSaidaValue: '1541202457',
            inputMeioTransporteValue: 'driving',
            latitude: null,
            longitude: null,
            isVisible: false,
        }
        this._setCurrentLocation = this._setCurrentLocation.bind(this);
        this._makeGetToMatrixAPI = this._makeGetToMatrixAPI.bind(this);
        this._handleInputOrigemValue = this._handleInputOrigemValue.bind(this);
        this._handleInputDestinoValue = this._handleInputDestinoValue.bind(this);
        this._showModal = this._showModal.bind(this);
        this._hiddenModal = this._hiddenModal.bind(this);
    }

    componentWillMount(){
        this._setCurrentLocation();
    }

    _handleInputOrigemValue = (e) => {
        this.setState({inputOrigemValue:e});
    }

    _handleInputDestinoValue = (e) => {
        this.setState({inputDestinoValue:e});
    }


    _handleinputHoraSaidaValue = (e) => {
        this.setState({inputHoraSaidaValue:e});
    }

    _handleinputMeioTransporteValue = (e) => {
        this.setState({inputMeioTransporteValue:e});
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
         const {inputOrigemValue, inputDestinoValue, inputHoraSaidaValue, inputMeioTransporteValue, erro, latitude,longitude} = this.state;

        var sTransit = '';
        if (inputMeioTransporteValue == 'transit') {
            sTransit = '&departure_time=' + inputHoraSaidaValue + '&traffic_model=best_guess'
        }

        const uri = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=' + inputOrigemValue + '&destinations=' + inputDestinoValue +'&mode=' + inputMeioTransporteValue + sTransit + '&key=AIzaSyBFuewXNO2PKsVBRj6KFapeSU9XUc8ARg0';

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
                origem: '',
                destino: '',
                distancia: '',
                tempo:'',
                erro: err.toString(),
            }) )
        this._showModal();
    }

    render(){


        return(



            <ScrollView>
                <KeyboardAvoidingView
                    behavior="padding"
                    style={style.root}
                >

                    <View style={{backgroundColor:'white', height:26, margin:0}}/>
                    <View style={style.container}>

                        <View style={{borderRadius:5,borderColor:'red'}}>
                            <FormLabel >Origem(lat,long):</FormLabel>
                            <FormInput  inputStyle={style.input}
                                        onChangeText={this._handleInputOrigemValue}
                                        value={this.state.inputOrigemValue}
                            />

                            <FormLabel >Destino(lat,long):</FormLabel>
                            <FormInput  inputStyle={style.input}
                                        onChangeText={this._handleInputDestinoValue}
                                        value={this.state.inputDestinoValue}/>

                            <FormLabel >Meio de Transporte:</FormLabel>
                            <Picker selectedValue ={this.state.inputMeioTransporteValue}
                                    onValueChange ={this._handleinputMeioTransporteValue}>
                                <Picker.Item label = "bicycling" value = "bicycling" />
                                <Picker.Item label = "driving" value = "driving" />
                                <Picker.Item label = "transit" value = "transit" />
                                <Picker.Item label = "walking" value = "walking" />
                            </Picker>

                            <FormLabel >Hora de Partida:</FormLabel>
                            <FormInput  inputStyle={style.input}
                                        onChangeText={this._handleinputHoraSaidaValue}
                                        value={this.state.inputHoraSaidaValue}/>


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
                                <Text style={style.textModal}>{`Latitude: ${this.state.inputOrigemValue}`}</Text>
                            </View>
                            <View style={{ marginTop:5}}>
                                <Text style={style.textModal}>{`Longitude: ${this.state.inputDestinoValue}`}</Text>
                            </View>
                            <View style={{ marginTop:5}}>
                                <Text style={style.textModal}>{`Meio de Transporte: ${this.state.inputMeioTransporteValue}`}</Text>
                            </View>
                            <View style={{ marginTop:5}}>
                                <Text style={style.textModal}>{`Hora de Partida: ${this.state.inputHoraSaidaValue}`}</Text>
                            </View>



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

                            <View style={style.buttonContainer}>
                                <Button
                                    onPress={() => this._hiddenModal()}
                                    buttonStyle={style.button}
                                    title='Voltar' />
                            </View>
                        </View>
                    </Modal>


                </KeyboardAvoidingView>
    </ScrollView>
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
        fontSize: 14,
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