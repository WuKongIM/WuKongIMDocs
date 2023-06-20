import React, { useRef } from 'react';
import './style.scss';

import { usePrefersColor } from 'dumi/dist/client/theme-api/usePrefersColor';

const Home: any = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [color] = usePrefersColor();

    // mount
    React.useEffect(() => {
        document.title = '悟空IM';
        const element = document.getElementById('root')
        element?.setAttribute('home', 'true')

        const logoElement = document.querySelector('.dumi-default-logo img');
        logoElement?.setAttribute('src', '/logo_white.png')
        return () => {
            const element = document.getElementById('root')
            element?.removeAttribute('home')

            logoElement?.setAttribute('src', '/logo.png')
        };
    }, []);

    var isPhone = true
    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        isPhone = true
    } else {
        isPhone = false
    }

    var item1 = {
        icon: './././imgs/ic_no_dependency.png',
        title: '零依赖',
        desc: '没有依赖任何第三方组件，部署简单，一条命令即可启动'
    }
    var item2 = {
        icon: './././imgs/ic_self_developed.png',
        title: '完全自研',
        desc: '自研消息数据库，消息分区永久存储，自研二进制协议，支持自定义协议'
    }
    var item3 = {
        icon: './././imgs/ic_secure.png',
        title: '安全',
        desc: '消息通道和消息内容全程加密，防中间人攻击和串改消息内容'
    }

    var item4 = {
        icon: './././imgs/ic_function.png',
        title: '功能强劲',
        desc: 'MAC 笔记本单机测试 16w 多/秒的消息(包含存储)吞吐量，频道支持万人同时订阅'
    }

    var item5 = {
        icon: './././imgs/ic_extend.png',
        title: '扩展性强',
        desc: '采用频道设计理念，目前支持群组频道，点对点频道，后续可以根据自己业务自定义频道可实现机器人频道，客服频道等等'
    }

    var item6 = {
        icon: './././imgs/ic_compatibility.png',
        title: '兼容性强',
        desc: '同时无差别支持 tcp，websocket'
    }
    var list1 = []
    var list2 = []
    var list3 = []

    list1.push(item1)
    list1.push(item2)
    if (!isPhone) {
        list1.push(item3)
        list2.push(item4)
        list2.push(item5)
        list2.push(item6)
    } else {
        list2.push(item3)
        list2.push(item4)
        list3.push(item5)
        list3.push(item6)
    }

    return (
        <section className="home-page">
            <div className="banner">

                <div className={`content ${color}`} style={{ backgroundImage: 'url(./././imgs/ic_bg.png)' }}>

                    <label className="center-title">悟空IM</label>
                    <label className="center-small-text">让信息传递更简单</label>
                    <div className={`btn-view ${color}`}>
                        <a href="/guide/guide" className="btn">立即上手</a>
                        <a style={{ marginLeft: '30px' }} target="_blank" href="https://github.com/WuKongIM/WuKongIM"
                            className="btn">Github</a>
                    </div>
                    <p className="content-text">悟空IM是高性能通用即时通讯服务，支持聊天应用，消息推送，物联网通讯，音视频信令，直播弹幕，客服系统，AI 通讯，即时社区等场景。</p>
                </div>

                <div className="des">
                    <div className={`card ${color}`}>
                        <div className='bg'>
                            <label className="big-font">特性</label>
                            <div style={{ marginTop: '37px', display: 'flex' }}>
                                {
                                    list1.map((item: any) =>
                                        <div className='card-item' style={{ width: isPhone ? '50%' : '33.3%' }}>
                                            <img className="img" src={item.icon} />
                                            <label className="characteristic-title">{item.title}</label>
                                            <label className="characteristic-content">{item.desc}</label>
                                        </div>
                                    )
                                }
                            </div>
                            <div style={{ display: 'flex' }}>
                                {
                                    list2.map((item: any) =>
                                        <div className='card-item' style={{ width: isPhone ? '50%' : '33.3%' }}>
                                            <img className="img" src={item.icon} />
                                            <label className="characteristic-title">{item.title}</label>
                                            <label className="characteristic-content">{item.desc}</label>
                                        </div>
                                    )
                                }
                            </div>
                            <div style={{ display: 'flex' }} >
                                {
                                    list3.map((item: any) =>
                                        <div className='card-item' style={{ width: isPhone ? '50%' : '33.3%' }}>
                                            <img className="img" src={item.icon} />
                                            <label className="characteristic-title">{item.title}</label>
                                            <label className="characteristic-content">{item.desc}</label>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Home;