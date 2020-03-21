import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Util from '../utils/util'
import Orientation from 'react-native-orientation-locker'
import Progress from './Progress'

interface IProps {
  changeCurrentTime: (rate: number) => void
  changeProgress: (rate: number) => void
  changeRateVisible: (visible: boolean) => void
  currentTime: number
  duration: number
  paused: boolean
  changePaused: () => void
  isPortrait: boolean
  rate: number
}

const TotalTime: React.FC<{ duration: number }> = React.memo((props) => {
  return <Text style={{
    color: '#fff',
  }}>{` / ${Util.formSecondTotHMS(props.duration)}`}</Text>
})

const StartAndPaused: React.FC<Pick<IProps, 'changePaused' | 'paused'>> = React.memo((props) => {
  return <TouchableOpacity
    onPress={props.changePaused}
    style={{
      height: '100%',
      width: 50,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
    <Image style={props.paused ? { height: 20, width: 20 } : { height: 16, width: 16 }}
           source={props.paused ? require('../images/play.png') : require('../images/pause.png')}/>
  </TouchableOpacity>
})


type IControlRight = {
  changeRateVisible(visible: boolean): void,
  isPortrait: boolean,
  rate: number,
}
const ControlRight: React.FC<IControlRight> = React.memo((props) => {
  const { changeRateVisible, isPortrait, rate } = props
  return <View style={styles.toolRight}>

    <TouchableOpacity
      onPress={() => {
        changeRateVisible(true)
      }}
      style={{
        height: '100%',
        width: 50,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <Text
        style={{ color: '#fff' }}>{rate == 1 ? '倍速' : rate + 'x'}</Text>
    </TouchableOpacity>

    {isPortrait && <TouchableOpacity
        onPress={() => {
          Orientation.lockToLandscapeRight()
        }}
        style={{
          height: '100%',
          width: 50,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        <Image style={{ height: 16, width: 16 }}
               source={require('../images/bigScreen.png')}/>
    </TouchableOpacity>
    }
  </View>
})


class Control extends React.Component<IProps> {

  state = {
    moveTime: 0 // 控制显示的时间
  }

  changeMoveTime = (rate: number) => {
    this.setState({ moveTime: this.props.duration * rate })
  }

  clearMoveTime = () => {
    this.setState({ moveTime: 0 })
  }

  complete = (rate: number) => {
    if (!this.props.paused) {
      this.setState({ moveTime: 0 })
    }
    // console.log('control complete',rate, this.props.duration)
    this.props.changeProgress(rate * this.props.duration)
  }

  render() {
    const { moveTime } = this.state
    const { changePaused, paused, duration, currentTime, rate, isPortrait, changeRateVisible } = this.props
    const time = moveTime ? moveTime : currentTime
    // console.log('render control', currentTime / duration)
    return (
      <>
        <Progress style={styles.slider}
                  gap={5}
                  value={currentTime / duration}
                  onMove={this.changeMoveTime}
                  onEnd={this.complete}
        />
        <View style={styles.tools}>
          <View style={styles.toolLeft}>
            <StartAndPaused paused={paused} changePaused={changePaused}/>
            <Text style={{
              color: '#fff',
            }}>{Util.formSecondTotHMS(time)}</Text>
            <TotalTime duration={duration}/>
          </View>
          <ControlRight rate={rate} isPortrait={isPortrait} changeRateVisible={changeRateVisible}/>
        </View>
      </>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  slider: {
    flex: 1,
    height: 30,
    justifyContent: 'center',
  },
  tools: {
    flexDirection: 'row',
    justifyContent: 'center',
    // alignItems: 'center',
    width: '100%',
    height: '50%',
    backgroundColor: 'rgba(0,0,0,0)'
  },
  toolLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
    height: '100%',
  },
  toolRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0)'
  }
})

export default Control
