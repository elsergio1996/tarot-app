import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, StyleSheet, Image, Alert, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from './src/theme';

const cards = [
  ['☀','El Sol'], ['☾','La Luna'], ['★','La Estrella'], ['♛','La Emperatriz'], ['⚖','La Justicia'], ['∞','El Mago']
];
const nav = [
  ['home','Inicio'], ['cards-playing-outline','Tirada'], ['message-text-outline','Consultas'], ['video-outline','En vivo'], ['calendar-month-outline','Agenda']
];

export default function App(){
  const [loggedIn,setLoggedIn]=useState(false);
  const [username,setUsername]=useState('');
  const [password,setPassword]=useState('');
  const [tab,setTab]=useState('Inicio');
  const [picked,setPicked]=useState(null);
  const [selected,setSelected]=useState([]);
  const visibleCards=useMemo(()=>cards.slice(0,5),[]);

  const pickImage=async()=>{
    const p=await ImagePicker.requestMediaLibraryPermissionsAsync();
    if(!p.granted){Alert.alert('Permiso requerido','Necesitamos acceso para subir imágenes de cartas.');return;}
    const r=await ImagePicker.launchImageLibraryAsync({mediaTypes:['images'],quality:0.85});
    if(!r.canceled) setPicked(r.assets[0].uri);
  };

  const toggleCard=(name)=>setSelected(s=>s.includes(name)?s.filter(x=>x!==name):s.length<3?[...s,name]:s);

  const login=()=>{
    if(username.trim().toLowerCase()==='clara' && password==='ambar2026'){
      setLoggedIn(true); setPassword('');
    } else {
      Alert.alert('Acceso denegado','Usuario o contraseña incorrectos.');
    }
  };

  if(!loggedIn) return <SafeAreaView style={s.safe}>
    <StatusBar style="light" />
    <View style={s.loginWrap}>
      <View style={s.loginCard}>
        <Text style={s.loginMoon}>☾</Text>
        <Text style={s.brandLogin}>ARCANA PRIVADA</Text>
        <Text style={s.loginTitle}>Panel de administración</Text>
        <Text style={s.loginSub}>Ingresá con tu cuenta de tarotista administradora.</Text>
        <TextInput value={username} onChangeText={setUsername} autoCapitalize="none" placeholder="Usuario" placeholderTextColor={theme.muted} style={s.input}/>
        <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Contraseña" placeholderTextColor={theme.muted} style={s.input}/>
        <TouchableOpacity style={s.primary} onPress={login}><Text style={s.primaryText}>Ingresar como administradora</Text></TouchableOpacity>
        <Text style={s.loginHint}>Acceso privado · datos locales de demostración</Text>
      </View>
    </View>
  </SafeAreaView>;

  return <SafeAreaView style={s.safe}>
    <StatusBar style="light" />
    <View style={s.topbar}>
      <View><Text style={s.brand}>ARCANA PRIVADA</Text><Text style={s.caption}>Tarot · Consultas privadas</Text></View>
      <TouchableOpacity style={s.avatar} onPress={()=>setLoggedIn(false)}><Text style={s.avatarText}>C</Text></TouchableOpacity>
    </View>
    <ScrollView contentContainerStyle={s.content}>
      {tab==='Inicio' && <>
        <View style={s.hero}>
          <Text style={s.eyebrow}>TU ESPACIO DE CONSULTA</Text>
          <Text style={s.heroTitle}>Una experiencia de tarot íntima y profesional.</Text>
          <Text style={s.heroBody}>Recibí consultas, imágenes, reservas y sesiones en vivo desde un mismo lugar.</Text>
          <TouchableOpacity style={s.primary} onPress={()=>setTab('Tirada')}><Text style={s.primaryText}>Comenzar una tirada</Text></TouchableOpacity>
        </View>
        <Text style={s.section}>Accesos rápidos</Text>
        <View style={s.grid}>
          <Quick icon="image-multiple-outline" title="Subir imágenes" text="Fotos de cartas o consulta" onPress={pickImage}/>
          <Quick icon="video-outline" title="Sesión en vivo" text="Consulta privada" onPress={()=>setTab('En vivo')}/>
          <Quick icon="calendar-clock" title="Reservas" text="Turnos y disponibilidad" onPress={()=>setTab('Agenda')}/>
          <Quick icon="account-heart-outline" title="Clientas" text="Historial y seguimiento" onPress={()=>setTab('Consultas')}/>
        </View>
        {picked && <View style={s.upload}><Image source={{uri:picked}} style={s.uploadImage}/><View style={{flex:1}}><Text style={s.cardTitle}>Imagen cargada</Text><Text style={s.muted}>Lista para adjuntar a una consulta.</Text></View></View>}
        <Text style={s.section}>Hoy</Text>
        <View style={s.panel}><Text style={s.cardTitle}>3 consultas programadas</Text><Text style={s.muted}>Próxima sesión · 21:30 · Lectura profunda</Text><View style={s.row}><Badge text="2 pendientes"/><Badge text="1 confirmada"/></View></View>
      </>}
      {tab==='Tirada' && <>
        <Text style={s.pageTitle}>Tirada de 3 cartas</Text><Text style={s.pageSub}>Elegí tres cartas. En la versión comercial podrás usar tus propios mazos.</Text>
        <View style={s.deck}>{visibleCards.map(([symbol,name])=>{
          const active=selected.includes(name);return <TouchableOpacity key={name} style={[s.tarotCard,active&&s.tarotActive]} onPress={()=>toggleCard(name)}><Text style={s.symbol}>{symbol}</Text><Text style={s.tarotName}>{active?name:'ARCANA'}</Text></TouchableOpacity>})}</View>
        <View style={s.panel}><Text style={s.cardTitle}>{selected.length}/3 seleccionadas</Text><Text style={s.muted}>{selected.length?selected.join(' · '):'Tocá las cartas para revelar tu selección.'}</Text></View>
        <TouchableOpacity style={[s.primary,selected.length!==3&&{opacity:.45}]} disabled={selected.length!==3}><Text style={s.primaryText}>Crear interpretación</Text></TouchableOpacity>
      </>}
      {tab==='Consultas' && <>
        <Text style={s.pageTitle}>Consultas privadas</Text><Text style={s.pageSub}>Central de mensajes, imágenes y seguimiento de cada clienta.</Text>
        {['Mariana · Amor y vínculos','Lucía · Lectura general','Carla · Decisión laboral'].map((x,i)=><View style={s.consult} key={x}><View style={s.dot}/><View style={{flex:1}}><Text style={s.cardTitle}>{x}</Text><Text style={s.muted}>{i===0?'Nuevo mensaje y 2 imágenes':'Historial disponible'}</Text></View><Text style={s.chev}>›</Text></View>)}
      </>}
      {tab==='En vivo' && <>
        <Text style={s.pageTitle}>Tarot en vivo</Text><Text style={s.pageSub}>Sala privada preparada para integrar videollamadas, chat y temporizador de sesión.</Text>
        <View style={s.live}><MaterialCommunityIcons name="video-outline" size={60} color={theme.gold}/><Text style={s.liveTitle}>Sala privada</Text><Text style={s.muted}>La integración de video se conecta en la fase de backend.</Text><TouchableOpacity style={s.primary}><Text style={s.primaryText}>Abrir sala de prueba</Text></TouchableOpacity></View>
      </>}
      {tab==='Agenda' && <>
        <Text style={s.pageTitle}>Agenda</Text><Text style={s.pageSub}>Horarios, reservas y estado de cada consulta.</Text>
        {['21:30 · Mariana','22:15 · Lucía','Mañana 18:00 · Carla'].map((x,i)=><View style={s.consult} key={x}><View style={[s.timeBox,i===0&&{borderColor:theme.gold}]}><Text style={s.timeText}>{i===0?'HOY':i===1?'HOY':'17'}</Text></View><View style={{flex:1}}><Text style={s.cardTitle}>{x}</Text><Text style={s.muted}>{i===1?'Pendiente de confirmación':'Confirmada'}</Text></View></View>)}
      </>}
    </ScrollView>
    <View style={s.nav}>{nav.map(([icon,label])=><TouchableOpacity key={label} style={s.navItem} onPress={()=>setTab(label)}><MaterialCommunityIcons name={icon} size={22} color={tab===label?theme.gold:theme.muted}/><Text style={[s.navText,tab===label&&{color:theme.gold}]}>{label}</Text></TouchableOpacity>)}</View>
  </SafeAreaView>
}

function Quick({icon,title,text,onPress}){return <TouchableOpacity style={s.quick} onPress={onPress}><MaterialCommunityIcons name={icon} size={27} color={theme.gold}/><Text style={s.cardTitle}>{title}</Text><Text style={s.muted}>{text}</Text></TouchableOpacity>}
function Badge({text}){return <View style={s.badge}><Text style={s.badgeText}>{text}</Text></View>}

const s=StyleSheet.create({
  safe:{flex:1,backgroundColor:theme.bg}, topbar:{paddingHorizontal:20,paddingVertical:14,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:'#382547'}, brand:{color:theme.gold,fontSize:18,fontWeight:'800',letterSpacing:1.5}, caption:{color:theme.muted,fontSize:11,marginTop:2}, avatar:{width:38,height:38,borderRadius:20,borderWidth:1,borderColor:theme.gold,alignItems:'center',justifyContent:'center',backgroundColor:theme.panel},avatarText:{color:theme.gold,fontWeight:'800'}, content:{padding:18,paddingBottom:120}, hero:{backgroundColor:theme.panel2,borderWidth:1,borderColor:'#4A315E',borderRadius:24,padding:22,overflow:'hidden'},eyebrow:{color:theme.gold,fontSize:11,fontWeight:'800',letterSpacing:1.4},heroTitle:{color:theme.text,fontWeight:'900',fontSize:30,lineHeight:35,marginTop:10},heroBody:{color:theme.muted,lineHeight:20,marginTop:10},primary:{backgroundColor:theme.gold,paddingVertical:14,paddingHorizontal:18,borderRadius:14,alignItems:'center',marginTop:18},primaryText:{color:'#211429',fontWeight:'900'},section:{color:theme.text,fontSize:18,fontWeight:'800',marginTop:24,marginBottom:12},grid:{flexDirection:'row',flexWrap:'wrap',gap:10},quick:{width:'48.5%',backgroundColor:theme.panel,borderRadius:18,padding:15,borderWidth:1,borderColor:'#352445',minHeight:120},cardTitle:{color:theme.text,fontWeight:'800',fontSize:15,marginTop:8},muted:{color:theme.muted,fontSize:12,lineHeight:17,marginTop:4},panel:{backgroundColor:theme.panel,borderRadius:18,padding:16,borderWidth:1,borderColor:'#352445',marginTop:10},row:{flexDirection:'row',gap:8,marginTop:12},badge:{paddingVertical:6,paddingHorizontal:10,borderRadius:20,backgroundColor:'#332043'},badgeText:{color:theme.gold,fontWeight:'700',fontSize:11},upload:{flexDirection:'row',gap:12,alignItems:'center',backgroundColor:theme.panel,borderRadius:18,padding:10,marginTop:12},uploadImage:{width:70,height:70,borderRadius:12},pageTitle:{color:theme.text,fontSize:28,fontWeight:'900'},pageSub:{color:theme.muted,lineHeight:20,marginTop:7,marginBottom:18},deck:{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',gap:10},tarotCard:{width:'30%',aspectRatio:.63,borderRadius:16,backgroundColor:'#241431',borderWidth:1,borderColor:'#65437A',alignItems:'center',justifyContent:'center',padding:8},tarotActive:{borderColor:theme.gold,borderWidth:2,backgroundColor:'#352045'},symbol:{fontSize:36,color:theme.gold},tarotName:{fontSize:10,color:theme.text,fontWeight:'800',textAlign:'center',marginTop:12},consult:{flexDirection:'row',alignItems:'center',gap:12,backgroundColor:theme.panel,borderRadius:17,padding:14,borderWidth:1,borderColor:'#352445',marginBottom:10},dot:{width:12,height:12,borderRadius:8,backgroundColor:theme.success},chev:{color:theme.gold,fontSize:28},live:{backgroundColor:theme.panel2,borderRadius:24,padding:28,alignItems:'center',borderWidth:1,borderColor:'#4A315E'},liveTitle:{color:theme.text,fontWeight:'900',fontSize:23,marginTop:12},timeBox:{width:48,height:48,borderRadius:12,borderWidth:1,borderColor:'#64437B',alignItems:'center',justifyContent:'center'},timeText:{color:theme.gold,fontWeight:'900',fontSize:11},nav:{position:'absolute',bottom:0,left:0,right:0,backgroundColor:'#160D20F5',borderTopWidth:1,borderTopColor:'#382547',flexDirection:'row',paddingBottom:12,paddingTop:10},navItem:{flex:1,alignItems:'center'},navText:{color:theme.muted,fontSize:9,marginTop:4},
  loginWrap:{flex:1,justifyContent:'center',padding:22},loginCard:{backgroundColor:theme.panel2,borderRadius:26,padding:24,borderWidth:1,borderColor:'#4A315E'},loginMoon:{color:theme.gold,fontSize:54,textAlign:'center'},brandLogin:{color:theme.gold,fontSize:19,fontWeight:'900',letterSpacing:1.8,textAlign:'center',marginTop:6},loginTitle:{color:theme.text,fontSize:26,fontWeight:'900',textAlign:'center',marginTop:20},loginSub:{color:theme.muted,textAlign:'center',lineHeight:19,marginTop:8,marginBottom:18},input:{backgroundColor:theme.panel,borderWidth:1,borderColor:'#4A315E',borderRadius:14,paddingHorizontal:15,paddingVertical:13,color:theme.text,marginTop:10},loginHint:{color:theme.muted,fontSize:10,textAlign:'center',marginTop:14}
});
