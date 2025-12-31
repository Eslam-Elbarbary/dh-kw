import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function VerificationCode() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleVerify = () => {
    // Simulate user data - in real app, this would come from API response
    const userData = {
      firstName: 'User',
      lastName: 'Name',
      email: 'user@example.com',
      phone: '+965 XXX XXXX'
    };
    
    // Log user in
    login(userData);
    
    // Navigate to home after verification
    navigate('/');
  };

  return (
    <div className="bg-[#fafafa] content-stretch flex flex-col items-start justify-center px-[64px] py-[48px] relative rounded-[4px] shadow-[0px_0px_44px_0px_rgba(142,9,9,0.1)] size-full min-h-screen" data-name="Container" data-node-id="35:4793">
      <div className="content-stretch flex flex-col gap-[40px] items-start relative shrink-0 mx-auto" data-name="form" data-node-id="35:4794">
        <div className="content-stretch flex flex-col gap-[8px] items-start leading-[0] not-italic relative shrink-0" data-node-id="35:4795">
          <div className="capitalize flex flex-col font-['Poppins'] font-semibold justify-center min-w-full relative shrink-0 text-[#0e1c47] text-[32px] tracking-[-0.96px] w-[min-content]" data-node-id="35:4796">
            <p className="leading-none whitespace-pre-wrap" dir="auto">
              Verification Code
            </p>
          </div>
          <div className="flex flex-col font-['Poppins'] font-normal justify-center relative shrink-0 text-[#121212] text-[16px] whitespace-nowrap" data-node-id="35:4797">
            <p className="leading-[normal]" dir="auto">
              Enter the verification code sent to your WhatsApp
            </p>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-[368px]" data-node-id="35:4798">
          <div className="flex flex-col font-['Poppins'] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#121212] text-[18px] w-full" data-node-id="35:4799">
            <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
              Code
            </p>
          </div>
          <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-node-id="35:4800">
            <input type="text" maxLength={1} className="border border-[#e6e6e6] border-solid content-stretch flex flex-[1_0_0] flex-col items-center justify-center min-h-px min-w-px px-[32px] py-[16px] relative rounded-[16px] shrink-0 capitalize font-['Poppins'] font-normal text-[#999] text-[24px] text-center" data-node-id="35:4801" />
            <input type="text" maxLength={1} className="border border-[#e6e6e6] border-solid content-stretch flex flex-[1_0_0] flex-col items-center justify-center min-h-px min-w-px px-[32px] py-[16px] relative rounded-[16px] shrink-0 capitalize font-['Cairo'] font-normal text-[#999] text-[24px] text-center" data-node-id="35:4803" />
            <input type="text" maxLength={1} className="border border-[#e6e6e6] border-solid content-stretch flex flex-[1_0_0] flex-col items-center justify-center min-h-px min-w-px px-[32px] py-[16px] relative rounded-[16px] shrink-0 capitalize font-['Cairo'] font-normal text-[#999] text-[24px] text-center" data-node-id="35:4805" />
            <input type="text" maxLength={1} className="border border-[#e6e6e6] border-solid content-stretch flex flex-[1_0_0] flex-col items-center justify-center min-h-px min-w-px px-[32px] py-[16px] relative rounded-[16px] shrink-0 capitalize font-['Cairo'] font-normal text-[#999] text-[24px] text-center" data-node-id="35:4807" />
          </div>
        </div>
        <button onClick={handleVerify} className="bg-[#0e1c47] content-stretch cursor-pointer flex h-[56px] items-center justify-center p-[16px] relative rounded-[4px] shrink-0 w-full hover:opacity-90 transition-opacity" data-name="cta" data-node-id="35:4809">
          <div className="capitalize flex flex-col font-['Poppins'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-left text-white tracking-[-0.18px] whitespace-nowrap" data-node-id="35:4811">
            <p className="leading-[1.2]" dir="auto">{`Verify `}</p>
          </div>
        </button>
      </div>
    </div>
  );
}

