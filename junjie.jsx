import React, { useState, useEffect } from 'react';
import { Home, ChevronsUp, Users, ShieldCheck, Award, Send, MessageCircle } from 'lucide-react';

const JunJieApp = () => {
  // 应用状态管理
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('home-page');
  const [user, setUser] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    address: '',
    agreement: false
  });
  
  // 社交资料数据
  const socialProfiles = [
    { name: '思妤', age: 24, avatar: '64/E6A26B', hobbies: ['爬山', '看電影'] },
    { name: '靜宜', age: 22, avatar: '64/F2B4A1', hobbies: ['美食家', '旅行'] },
    { name: '雅涵', age: 26, avatar: '64/DDBEA9', hobbies: ['閱讀', '瑜珈'] },
    { name: '心怡', age: 23, avatar: '64/C2B2A8', hobbies: ['攝影', '畫畫'] },
    { name: '佳穎', age: 25, avatar: '64/A98F80', hobbies: ['跳舞', '音樂'] },
    { name: '惠玲', age: 27, avatar: '64/8E8E9F', hobbies: ['烘焙', '手作'] },
    { name: '曉婷', age: 24, avatar: '64/B8B8D1', hobbies: ['潛水', '衝浪'] },
    { name: '宜君', age: 28, avatar: '64/DEDEEB', hobbies: ['志工', '園藝'] },
    { name: '佩珊', age: 22, avatar: '64/F5D5D5', hobbies: ['看展', '戲劇'] },
    { name: '詩涵', age: 26, avatar: '64/E9C3C3', hobbies: ['健身', '寵物'] },
    { name: '文琪', age: 25, avatar: '64/D3A5A5', hobbies: ['投資', '學習'] },
    { name: '嘉玲', age: 29, avatar: '64/BDA0A0', hobbies: ['品酒', '烹飪'] },
  ];
  
  // 身份等级
  const ranks = ['黨員', '黨支部書記', '黨委書記', '黨組領導'];
  
  // 初始化应用
  useEffect(() => {
    // 从localStorage加载用户数据
    const savedUser = localStorage.getItem('junJieAppUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // 显示启动画面
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // 保存用户数据
  useEffect(() => {
    if (user) {
      localStorage.setItem('junJieAppUser', JSON.stringify(user));
    }
  }, [user]);
  
  // 显示通知
  const showNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };
  
  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // 处理注册表单提交
  const handleRegistration = (e) => {
    e.preventDefault();
    
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    
    const newUser = {
      isRegistered: true,
      name: formData.name,
      dateOfBirth: formData.dob,
      address: formData.address,
      registrationDate: `${yyyy}-${mm}-${dd}`,
      idCardNumber: generateIdCardNumber(formData.dob),
      invitedCount: 0,
    };
    
    setUser(newUser);
    showNotification('注册成功！欢迎加入！');
  };
  
  // 生成身份证号码
  const generateIdCardNumber = (dob) => {
    const datePart = dob.replace(/-/g, '');
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `910000${datePart}${randomPart}`;
  };
  
  // 计算注册天数
  const calculateDaysRegistered = () => {
    if (!user || !user.registrationDate) return 0;
    
    const regDate = new Date(user.registrationDate);
    const today = new Date();
    const diffTime = Math.abs(today - regDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };
  
  // 计算茶叶蛋数量
  const calculateEggsCount = () => {
    return calculateDaysRegistered() * 10;
  };
  
  // 生成QR码
  const generateQRCode = () => {
    const dots = [];
    for (let i = 0; i < 100; i++) {
      const isBlack = Math.random() > 0.4;
      dots.push(
        <div 
          key={i} 
          className={`w-full h-full ${isBlack ? 'bg-black' : 'bg-white'}`}
        />
      );
    }
    return dots;
  };
  
  // 复制邀请链接
  const copyInviteLink = () => {
    const textToCopy = `我已投誠大陸，點擊連結跟我一起投誠領取茶葉蛋：${window.location.href}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      showNotification('邀請文案及連結已複製到剪貼簿！');
    }).catch(err => {
      showNotification('複製失敗，請手動分享。');
    });
  };
  
  // 计算当前等级
  const calculateCurrentRank = () => {
    if (!user) return ranks[0];
    
    const count = user.invitedCount;
    const rankIndex = Math.floor(count / 10);
    return ranks[Math.min(rankIndex, ranks.length - 1)];
  };
  
  // 计算邀请进度
  const calculateInviteProgress = () => {
    if (!user) return 0;
    
    const currentRank = calculateCurrentRank();
    if (currentRank === ranks[ranks.length - 1]) {
      return 100;
    }
    
    return (user.invitedCount % 10) / 10 * 100;
  };
  
  // 启动画面组件
  const SplashScreen = () => (
    <div className={`fixed inset-0 bg-gray-50 flex flex-col justify-center items-center z-50 p-8 ${showSplash ? 'animate-fadeIn' : 'animate-fadeOut'}`}>
      <div className="text-center">
        <ShieldCheck className="mx-auto text-red-600 w-20 h-20" />
        <h1 className="text-4xl font-bold text-gray-800 mt-4">俊傑 App</h1>
        <p className="text-lg text-gray-600 mt-4">@台灣同胞，識時務者為俊傑</p>
      </div>
      <button 
        onClick={() => setShowSplash(false)}
        className="absolute bottom-16 w-11/12 max-w-sm px-4 py-3 text-lg font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
      >
        進入應用
      </button>
    </div>
  );
  
  // 首页组件
  const HomePage = () => (
    <div className="p-4 md:p-6">
      {!user || !user.isRegistered ? (
        <div id="unregistered-view">
          <h2 className="text-2xl font-bold mb-6 text-center">歡迎歸鄉，請登記您的資訊</h2>
          <form onSubmit={handleRegistration} className="space-y-5">
            <div>
              <label htmlFor="name" className="font-medium text-gray-700">姓名</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mt-1"
                placeholder="請輸入姓名"
                required
              />
            </div>
            <div>
              <label htmlFor="dob" className="font-medium text-gray-700">出生日期</label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mt-1"
                required
              />
            </div>
            <div>
              <label htmlFor="address" className="font-medium text-gray-700">現住址</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mt-1"
                placeholder="請輸入現住址"
                required
              />
            </div>
            <div className="flex items-center pt-2">
              <input
                type="checkbox"
                id="agreement"
                name="agreement"
                checked={formData.agreement}
                onChange={handleInputChange}
                className="h-5 w-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                required
              />
              <label htmlFor="agreement" className="ml-3 text-sm text-gray-600">
                我已閱讀並同意，領取身份證即代表加入中國共產黨。
              </label>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-3 text-lg font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.03] transform mt-6"
              disabled={!formData.name || !formData.dob || !formData.address || !formData.agreement}
            >
              立即領取身份證
            </button>
          </form>
        </div>
      ) : (
        <div id="registered-view">
          <div className="bg-white rounded-xl shadow-lg p-6 border-t-8 border-red-600">
            <div className="flex items-center space-x-4">
              <Award className="text-yellow-500 w-12 h-12" />
              <div>
                <p className="text-lg text-gray-600">同志，歡迎您</p>
                <h2 className="text-3xl font-bold">{user.name}</h2>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 tracking-wider">中華人民共和國 居民身份證</p>
              <p className="text-2xl font-mono mt-2 bg-gray-100 p-3 rounded-md text-center tracking-widest">
                {user.idCardNumber}
              </p>
            </div>
            <div className="mt-4 flex justify-center">
              <div className="grid grid-cols-10 gap-0.5 bg-gray-200 p-2 rounded-lg w-32 h-32">
                {generateQRCode()}
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">掃描此碼，即可在關鍵時刻快速撤離戰場。</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <h3 className="text-xl font-bold">我的福利</h3>
            <div className="mt-4 text-center bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <p className="text-lg text-gray-700">
                您已歸鄉 <strong className="text-3xl font-bold text-red-600">{calculateDaysRegistered()}</strong> 天
              </p>
              <p className="mt-2 text-lg text-gray-700">
                已獲得 <strong className="text-3xl font-bold text-red-600">{calculateEggsCount()}</strong> 枚茶葉蛋
              </p>
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">
              每日可自動領取10枚茶葉蛋。請在台灣解放當天，憑 QR Code 到相關部門兌換。
            </p>
          </div>
        </div>
      )}
    </div>
  );
  
  // 升级页面组件
  const UpgradePage = () => (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">我的晉升之路</h2>
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <p className="text-gray-600">當前身份</p>
        <p className="text-4xl font-bold text-red-600 my-2">{calculateCurrentRank()}</p>
        <p className="text-sm text-gray-500">身份階級：黨員 → 黨支部書記 → 黨委書記 → 黨組領導</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
        <h3 className="text-xl font-bold mb-4">升級進度</h3>
        <p className="text-gray-700">每成功邀請10位同胞歸鄉，即可提升一次身份。</p>
        <p className="text-center text-2xl font-bold my-4">
          <span>{user ? user.invitedCount % 10 : 0}</span> / <span>10</span> 人
        </p>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="bg-red-600 h-4 rounded-full transition-all duration-500" 
            style={{ width: `${calculateInviteProgress()}%` }}
          ></div>
        </div>
        <button 
          onClick={copyInviteLink}
          className="w-full px-4 py-3 text-lg font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.03] transform mt-6 flex items-center justify-center gap-2"
        >
          <Send className="w-5 h-5" />
          <span>生成邀請連結</span>
        </button>
      </div>
    </div>
  );
  
  // 社交页面组件
  const SocialPage = () => (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">同志情誼</h2>
      <div className="gap-4" style={{ columnCount: 2 }}>
        {socialProfiles.map((profile, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-3 mb-4 break-inside-avoid">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48" />
            <div className="mt-3">
              <div className="flex justify-between items-center">
                <p className="font-bold text-lg">{profile.name}, {profile.age}</p>
                <MessageCircle className="text-red-500" />
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {profile.hobbies.map((hobby, idx) => (
                  <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {hobby}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  // 底部导航栏组件
  const TabBar = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around h-16 shadow-inner">
      <button 
        onClick={() => setActiveTab('home-page')}
        className={`flex flex-col items-center justify-center w-full ${
          activeTab === 'home-page' ? 'text-red-600' : 'text-gray-500'
        }`}
      >
        <Home className="w-6 h-6" />
        <span className="text-xs mt-1">首頁</span>
      </button>
      <button 
        onClick={() => setActiveTab('upgrade-page')}
        className={`flex flex-col items-center justify-center w-full ${
          activeTab === 'upgrade-page' ? 'text-red-600' : 'text-gray-500'
        }`}
      >
        <ChevronsUp className="w-6 h-6" />
        <span className="text-xs mt-1">升級</span>
      </button>
      <button 
        onClick={() => setActiveTab('social-page')}
        className={`flex flex-col items-center justify-center w-full ${
          activeTab === 'social-page' ? 'text-red-600' : 'text-gray-500'
        }`}
      >
        <Users className="w-6 h-6" />
        <span className="text-xs mt-1">交友</span>
      </button>
    </nav>
  );
  
  // 通知组件
  const ToastNotification = () => (
    <div className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-black bg-opacity-75 text-white rounded-full transition-opacity duration-300 ${
      showToast ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      {toastMessage}
    </div>
  );

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen pb-24">
      {showSplash && <SplashScreen />}
      
      <main className={`${showSplash ? 'hidden' : 'block'}`}>
        {activeTab === 'home-page' && <HomePage />}
        {activeTab === 'upgrade-page' && <UpgradePage />}
        {activeTab === 'social-page' && <SocialPage />}
      </main>
      
      {!showSplash && <TabBar />}
      <ToastNotification />
      
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.95); visibility: hidden; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        .animate-fadeOut {
          animation: fadeOut 0.5s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default JunJieApp;