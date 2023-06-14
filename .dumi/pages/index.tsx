import React, { useRef } from 'react';
import './style.scss';
import { usePrefersColor } from 'dumi/dist/client/theme-api/usePrefersColor';

const Home: any = () => {
    document.title = '悟空IM';
    const ref = useRef<HTMLDivElement>(null);
    const [color] = usePrefersColor();

    // mount
    React.useEffect(() => {
        const element = document.getElementById('root')
        element?.setAttribute('home', 'true')
        return () => {
            const element = document.getElementById('root')
            element?.removeAttribute('home')
        };
    }, []);


    return (
        <section className="home-page">
            <div className="banner">

                <div className={`content ${color}`} style={{ backgroundImage: 'url(./././imgs/ic_bg.png)' }}>

                    <label className="center-title">悟空IM</label>
                    <label className="center-small-text">让信息传递更简单</label>
                    <div className={`btn-view ${color}`}>
                        <a href="/guide" className="btn">立即上手</a>
                        <a style={{ marginLeft: '30px' }} target="_blank" href="https://github.com/WuKongIM/WuKongIM"
                            className="btn">Github</a>
                    </div>
                    <p className="content-text">悟空IM是高性能通用即时通讯服务，支持聊天应用，消息推送，物联网通讯，音视频信令，直播弹幕，客服系统，AI 通讯，即时社区等场景。</p>
                </div>

                <div className="des">
                    <div className={`card ${color}`}>
                        <div className='bg'>
                            <label className="big-font">特性</label>
                            <div style={{ marginTop: '37px'}}>
                                <div style={{ display: 'flex' }}>
                                    <div className='card-item'>
                                        <img className="img" src='./././imgs/ic_no_dependency.png' />
                                        <label className="characteristic-title">零依赖</label>
                                        <label className="characteristic-content">没有依赖任何第三方组件，部署简单，一条命令即可启动</label>
                                    </div>
                                    <div className='card-item'>
                                        <img className="img" src="./././imgs/ic_self_developed.png" />
                                        <label className="characteristic-title">完全自研</label>
                                        <label className="characteristic-content">自研消息数据库，消息分区永久存储，自研二进制协议，支持自定义协议</label>
                                    </div>
                                    <div className='card-item'>
                                        <img className="img" src="./././imgs/ic_secure.png" />
                                        <label className="characteristic-title">安全</label>
                                        <label className="characteristic-content">消息通道和消息内容全程加密，防中间人攻击和串改消息内容。</label>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', marginTop: '30px', paddingBottom: '30px' }}>
                                    <div className='card-item'>
                                        <img className="img" src="./././imgs/ic_function.png" />
                                        <label className="characteristic-title">功能强劲</label>
                                        <label className="characteristic-content">MAC 笔记本单机测试 16w 多/秒的消息(包含存储)吞吐量，频道支持万人同时订阅。</label>
                                    </div>
                                    <div className='card-item'>
                                        <img className="img" src="./././imgs/ic_extend.png" />
                                        <label className="characteristic-title">扩展性强</label>
                                        <label
                                            className="characteristic-content">采用频道设计理念，目前支持群组频道，点对点频道，后续可以根据自己业务自定义频道可实现机器人频道，客服频道等等。</label>
                                    </div>
                                    <div className='card-item'>
                                        <img className="img" src="./././imgs/ic_compatibility.png" />
                                        <label className="characteristic-title">兼容性强</label>
                                        <label className="characteristic-content">同时无差别支持 tcp，websocket</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Home;