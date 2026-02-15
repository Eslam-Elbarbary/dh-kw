import { Link, useNavigate } from 'react-router-dom';

// Import assets
import flagIcon from '../assets/Layer 1.svg';

const imgLayer1 = flagIcon;
// Eye icon for password visibility - using inline SVG
const imgGroup = "data:image/svg+xml,%3Csvg width='20' height='13' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 0C5.5 0 1.73 3.11 0 7.5c1.73 4.39 5.5 7.5 10 7.5s8.27-3.11 10-7.5C18.27 3.11 14.5 0 10 0zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z' fill='%23999'/%3E%3C/svg%3E";

export default function SignUp() {
  const navigate = useNavigate();

  const handleSignUp = () => {
    // Navigate to verification page after sign up
    // User data will be saved after verification is complete
    navigate('/verification');
  };

  return (
    <div className="bg-[#fafafa] border border-[#e6e6e6] border-solid content-stretch flex flex-col items-start justify-center px-[64px] py-[48px] relative rounded-[4px] shadow-[0px_0px_44px_0px_rgba(142,9,9,0.1)] size-full min-h-screen" data-name="Sign / Phone" data-node-id="35:4736">
      <div className="content-stretch flex flex-col gap-[40px] items-start relative shrink-0 w-[382px] mx-auto" data-name="form" data-node-id="35:4737">
        <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-node-id="35:4738">
          <div className="content-stretch flex flex-col gap-[8px] items-start leading-[0] not-italic relative shrink-0 w-full" data-node-id="35:4739">
            <div className="capitalize flex flex-col font-['Poppins'] font-semibold justify-center relative shrink-0 text-[#0e1c47] text-[32px] tracking-[-0.96px] w-full" data-node-id="35:4740">
              <p className="leading-none whitespace-pre-wrap" dir="auto">
                Sign up
              </p>
            </div>
            <div className="flex flex-col font-['Poppins'] font-normal justify-center h-[32px] relative shrink-0 text-[#121212] text-[16px] w-full" data-node-id="35:4741">
              <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
                Enter your phone number to sign up
              </p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-full" data-node-id="35:4742">
            <div className="capitalize flex flex-col font-['Poppins'] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#121212] text-[18px] w-full" data-node-id="35:4743">
              <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
                first Name
              </p>
            </div>
            <div className="content-stretch flex items-start relative shrink-0 w-full" data-node-id="35:4744">
              <input type="text" className="border border-[#e6e6e6] border-solid content-stretch flex flex-[1_0_0] flex-col h-[48px] items-start justify-center min-h-px min-w-px p-[8px] relative rounded-[4px] shrink-0 w-full capitalize font-['Poppins'] font-normal text-[#999] text-[16px]" placeholder="Enter your first name" data-node-id="35:4745" />
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-full" data-node-id="39:3229">
            <div className="capitalize flex flex-col font-['Poppins'] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#121212] text-[18px] w-full" data-node-id="39:3230">
              <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
                last Name
              </p>
            </div>
            <div className="content-stretch flex items-start relative shrink-0 w-full" data-node-id="39:3231">
              <input type="text" className="border border-[#e6e6e6] border-solid content-stretch flex flex-[1_0_0] flex-col h-[48px] items-start justify-center min-h-px min-w-px p-[8px] relative rounded-[4px] shrink-0 w-full capitalize font-['Poppins'] font-normal text-[#999] text-[16px]" placeholder="Enter your last name" data-node-id="39:3232" />
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-full" data-node-id="35:4747">
            <div className="flex flex-col font-['Poppins'] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#121212] text-[18px] w-full" data-node-id="35:4748">
              <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
                Phone Number
              </p>
            </div>
            <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-node-id="35:4749">
              <div className="border border-[#e6e6e6] border-solid content-stretch flex gap-[8px] items-center p-[8px] relative rounded-[4px] shrink-0" data-node-id="35:4750">
                <div className="content-stretch flex items-center overflow-clip p-px relative shrink-0" data-name="svg2" data-node-id="35:4751">
                  <div className="relative shrink-0 size-[30px]" data-name="layer1" data-node-id="35:4752">
                    <img alt="" className="block max-w-none size-full" src={imgLayer1} />
                  </div>
                </div>
                <div className="capitalize flex flex-col font-['Poppins'] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#999] text-[16px] whitespace-nowrap" data-node-id="35:4759">
                  <p className="leading-[normal]">+966</p>
                </div>
              </div>
              <input type="tel" className="border border-[#e6e6e6] border-solid content-stretch flex flex-[1_0_0] flex-col h-[48px] items-start justify-center min-h-px min-w-px p-[8px] relative rounded-[4px] shrink-0 capitalize font-['Poppins'] font-normal text-[#999] text-[16px]" placeholder="Enter your Phone Number" data-node-id="35:4760" />
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-full" data-node-id="35:4762">
            <div className="flex flex-col font-['Poppins'] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#121212] text-[18px] w-full" data-node-id="35:4763">
              <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
                Email
              </p>
            </div>
            <div className="content-stretch flex items-start relative shrink-0 w-full" data-node-id="35:4764">
              <input type="email" className="border border-[#e6e6e6] border-solid content-stretch flex flex-[1_0_0] flex-col h-[48px] items-start justify-center min-h-px min-w-px p-[8px] relative rounded-[4px] shrink-0 w-full capitalize font-['Poppins'] font-normal text-[#999] text-[16px]" placeholder="Enter your Email" data-node-id="35:4765" />
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-full" data-node-id="35:4767">
            <div className="capitalize flex flex-col font-['Poppins'] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#121212] text-[18px] w-full" data-node-id="35:4768">
              <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
                pasword
              </p>
            </div>
            <div className="border border-[#e6e6e6] border-solid content-stretch flex h-[48px] items-center justify-between p-[8px] relative rounded-[4px] shrink-0 w-full" data-node-id="35:4769">
              <input type="password" className="capitalize flex flex-col font-['Poppins'] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#999] text-[16px] flex-1 outline-none border-none bg-transparent" placeholder="Enter your password" data-node-id="35:4770" />
              <div className="h-[13px] overflow-clip relative shrink-0 w-[20px]" data-name="Frame" data-node-id="35:4771">
                <div className="absolute contents inset-[0_0_7.69%_0]" data-name="Group" data-node-id="35:4772">
                  <div className="absolute inset-[0_0_7.69%_0]" data-name="Group" data-node-id="35:4773">
                    <img alt="" className="block max-w-none size-full" src={imgGroup} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-full" data-node-id="35:4775">
            <div className="capitalize flex flex-col font-['Poppins'] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#121212] text-[18px] w-full" data-node-id="35:4776">
              <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
                confirm Password
              </p>
            </div>
            <div className="border border-[#e6e6e6] border-solid content-stretch flex h-[48px] items-center justify-between p-[8px] relative rounded-[4px] shrink-0 w-full" data-node-id="35:4777">
              <input type="password" className="capitalize flex flex-col font-['Poppins'] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#999] text-[16px] flex-1 outline-none border-none bg-transparent" placeholder="Confirm your password" data-node-id="35:4778" />
              <div className="h-[13px] overflow-clip relative shrink-0 w-[20px]" data-name="Frame" data-node-id="35:4779">
                <div className="absolute contents inset-[0_0_7.69%_0]" data-name="Group" data-node-id="35:4780">
                  <div className="absolute inset-[0_0_7.69%_0]" data-name="Group" data-node-id="35:4781">
                    <img alt="" className="block max-w-none size-full" src={imgGroup} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0" data-node-id="35:4783">
            <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-node-id="35:4784">
              <input type="checkbox" className="border border-black border-solid rounded-[2px] shrink-0 size-[16px]" data-node-id="35:4785" />
              <div className="flex flex-col font-['Poppins'] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#0e1c47] text-[12px] whitespace-nowrap" data-node-id="35:4786">
                <p className="leading-[normal]">
                  <span className="text-black">I agree to the</span> <span className="[text-underline-position:from-font] decoration-solid text-[#0e1c47] underline">Terms</span>
                  <span className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid underline">{` & `}</span>
                  <span className="[text-underline-position:from-font] decoration-solid text-[#0e1c47] underline">Conditions</span>
                </p>
              </div>
            </div>
            <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-node-id="35:4787">
              <input type="checkbox" className="border border-black border-solid rounded-[2px] shrink-0 size-[16px]" data-node-id="35:4788" />
              <div className="flex flex-col font-['Poppins'] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black whitespace-nowrap" data-node-id="35:4789">
                <p className="leading-[normal]">I agree to receive marketing emails and newsletters.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="cta" data-node-id="35:4790">
          <button onClick={handleSignUp} className="bg-[#0e1c47] content-stretch cursor-pointer flex h-[56px] items-center justify-center p-[16px] relative rounded-[4px] shrink-0 w-full hover:opacity-90 transition-opacity" data-name="btn-01" data-node-id="35:4791">
            <div className="capitalize flex flex-col font-['Poppins'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-left text-white tracking-[-0.18px] whitespace-nowrap" data-node-id="35:4792">
              <p className="leading-[1.2]" dir="auto">
                Sign up
              </p>
            </div>
          </button>
          <Link to="/sign-in" className="content-stretch flex items-center justify-center p-[16px] relative rounded-[4px] shrink-0 w-full hover:opacity-80 transition-opacity">
            <div className="capitalize flex flex-col font-['Poppins'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#0e1c47] text-[16px] tracking-[-0.16px] whitespace-nowrap">
              <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid leading-[1.2] underline">Already have an account? Sign in</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

