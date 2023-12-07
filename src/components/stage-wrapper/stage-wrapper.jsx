import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import VM from 'scratch-vm';

import Box from '../box/box.jsx';
import {STAGE_DISPLAY_SIZES} from '../../lib/layout-constants.js';
import StageHeader from '../../containers/stage-header.jsx';
import Stage from '../../containers/stage.jsx';
import Loader from '../loader/loader.jsx';
import Webcam from 'react-webcam'

import styles from './stage-wrapper.css';

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

const StageWrapperComponent = function (props) {
    const {
        isFullScreen,
        isRtl,
        isRendererSupported,
        loading,
        stageSize,
        vm
    } = props;

    return (
        <Box
            className={classNames(
                styles.stageWrapper,
                {[styles.fullScreen]: isFullScreen}
            )}
            dir={isRtl ? 'rtl' : 'ltr'}
        >
            <Box className={styles.stageMenuWrapper}>
                <StageHeader
                    stageSize={stageSize}
                    vm={vm}
                />
            </Box>
            <Box className={styles.stageCanvasWrapper}>
                {
                    !isRendererSupported ?
                        <Stage
                            stageSize={stageSize}
                            vm={vm}
                        /> :
                        <Box>
                            <Webcam
                                style={{padding: '0px'}}
                                    audio={false}
                                    height={380}
                                    screenshotFormat="image/jpeg"
                                    width={580}
                                    videoConstraints={videoConstraints}
                                >
                                
                            </Webcam>
                        </Box>
                }
            </Box>
            {loading ? (
                <Loader isFullScreen={isFullScreen} />
            ) : null}
        </Box>
    );
};

StageWrapperComponent.propTypes = {
    isFullScreen: PropTypes.bool,
    isRendererSupported: PropTypes.bool.isRequired,
    isRtl: PropTypes.bool.isRequired,
    loading: PropTypes.bool,
    stageSize: PropTypes.oneOf(Object.keys(STAGE_DISPLAY_SIZES)).isRequired,
    vm: PropTypes.instanceOf(VM).isRequired
};

export default StageWrapperComponent;
