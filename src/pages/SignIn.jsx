import { Link, useNavigate } from 'react-router-dom';

const imgLayer1 = "https://www.figma.com/api/mcp/asset/797940c1-404d-484b-917a-4de758fc18c1";
const imgGroup = "https://www.figma.com/api/mcp/asset/ce098739-ba83-42a4-9756-79645750c548";

export default function SignIn() {
  const navigate = useNavigate();

  const handleSignIn = () => {
    // Navigate to verification or home after sign in
    navigate('/verification');
  };

  return (
    <div className="bg-[#fafafa] border border-[#e6e6e6] border-solid content-stretch flex flex-col items-start justify-center px-[64px] py-[48px] relative rounded-[4px] shadow-[0px_0px_44px_0px_rgba(142,9,9,0.1)] size-full min-h-screen" data-name="Sign / Phone" data-node-id="35:4702">
      <div className="content-stretch flex flex-col gap-[40px] items-start relative shrink-0 w-[382px] mx-auto" data-name="form" data-node-id="35:4703">
        <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full" data-node-id="35:4704">
          <div className="content-stretch flex flex-col gap-[8px] items-start leading-[0] not-italic relative shrink-0 w-full" data-node-id="35:4705">
            <div className="capitalize flex flex-col font-['Poppins'] font-semibold justify-center relative shrink-0 text-[#0e1c47] text-[32px] tracking-[-0.96px] w-full" data-node-id="35:4706">
              <p className="leading-none whitespace-pre-wrap" dir="auto">
                Sign in
              </p>
            </div>
            <div className="flex flex-col font-['Poppins'] font-normal h-[32px] justify-center relative shrink-0 text-[#121212] text-[16px] w-full" data-node-id="35:4707">
              <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
                Enter your phone number to sign in
              </p>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-full" data-node-id="35:4708">
            <div className="flex flex-col font-['Poppins'] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#121212] text-[18px] w-full" data-node-id="35:4709">
              <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
                Phone Number
              </p>
            </div>
            <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-node-id="35:4710">
              <div className="border border-[#e6e6e6] border-solid content-stretch flex gap-[8px] items-center p-[8px] relative rounded-[4px] shrink-0" data-node-id="35:4711">
                <div className="content-stretch flex items-center overflow-clip p-px relative shrink-0" data-name="svg2" data-node-id="35:4712">
                  <div className="relative shrink-0 size-[30px]" data-name="layer1" data-node-id="35:4713">
                    <img alt="" className="block max-w-none size-full" src={imgLayer1} />
                  </div>
                </div>
                <div className="capitalize flex flex-col font-['Poppins'] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#999] text-[16px] whitespace-nowrap" data-node-id="35:4720">
                  <p className="leading-[normal]">+966</p>
                </div>
              </div>
              <input type="tel" className="border border-[#e6e6e6] border-solid content-stretch flex flex-[1_0_0] flex-col h-[48px] items-start justify-center min-h-px min-w-px p-[8px] relative rounded-[4px] shrink-0 capitalize font-['Poppins'] font-normal text-[#999] text-[16px]" placeholder="Enter your Phone Number" data-node-id="35:4721" />
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0 w-full" data-node-id="35:4723">
            <div className="capitalize flex flex-col font-['Poppins'] font-semibold h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#121212] text-[18px] w-full" data-node-id="35:4724">
              <p className="leading-[normal] whitespace-pre-wrap" dir="auto">
                pasword
              </p>
            </div>
            <div className="border border-[#e6e6e6] border-solid content-stretch flex h-[48px] items-center justify-between p-[8px] relative rounded-[4px] shrink-0 w-full" data-node-id="35:4725">
              <input type="password" className="capitalize flex flex-col font-['Poppins'] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#999] text-[16px] flex-1 outline-none border-none bg-transparent" placeholder="Enter your password" data-node-id="35:4726" />
              <div className="h-[13px] overflow-clip relative shrink-0 w-[20px]" data-name="Frame" data-node-id="35:4727">
                <div className="absolute contents inset-[0_0_7.69%_0]" data-name="Group" data-node-id="35:4728">
                  <div className="absolute inset-[0_0_7.69%_0]" data-name="Group" data-node-id="35:4729">
                    <img alt="" className="block max-w-none size-full" src={imgGroup} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-name="cta" data-node-id="35:4731">
          <button onClick={handleSignIn} className="bg-[#0e1c47] content-stretch cursor-pointer flex h-[56px] items-center justify-center p-[16px] relative rounded-[4px] shrink-0 w-full hover:opacity-90 transition-opacity" data-name="btn-01" data-node-id="35:4732">
            <div className="capitalize flex flex-col font-['Poppins'] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[18px] text-left text-white tracking-[-0.18px] whitespace-nowrap" data-node-id="35:4733">
              <p className="leading-[1.2]" dir="auto">
                Sign in
              </p>
            </div>
          </button>
          <Link to="/sign-up" className="content-stretch flex items-center justify-center p-[16px] relative rounded-[4px] shrink-0 w-full hover:opacity-80 transition-opacity" data-name="btn-02" data-node-id="35:4734">
            <div className="capitalize flex flex-col font-['Poppins'] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#0e1c47] text-[16px] tracking-[-0.16px] whitespace-nowrap" data-node-id="35:4735">
              <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid leading-[1.2] underline">Don't have an account? Sign up</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

