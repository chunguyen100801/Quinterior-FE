import { Divider, Spinner } from '@nextui-org/react';
import { UserInFo } from '@/lucia-auth/auth-actions';
import AddNewAddress from './AddNewAddress';
import { getMyAddress } from '@/app/apis/address.api';
import AddressRow from './AddressRow';
import { MapPinned } from 'lucide-react';

interface Props {
  profile: UserInFo | null;
}

export default async function MyAddress({ profile: profileUser }: Props) {
  // const [isLoading, setIsLoading] = useState(false);
  const myAddressData = await getMyAddress();
  return (
    <>
      <div className="flex w-full flex-col items-center gap-2 md:flex md:flex-row md:justify-between">
        <div className="flex flex-col gap-[1rem]">
          <span className="text-[1.5rem]">My Addresses</span>
          <span className="mt-[-1rem] text-[0.8rem]">
            The address used to place the order
          </span>
        </div>
        <div className="mt-4 md:mt-0">
          <AddNewAddress profile={profileUser} myAddressData={myAddressData} />
        </div>
      </div>
      <Divider className="mt-4" />
      <div className="pb-20">
        <div
          className={`flex h-full ${
            Array.isArray(myAddressData) &&
            myAddressData.length > 0 &&
            'min-h-[30vh] '
          } flex-col space-y-12`}
        >
          <div className=" flex h-full items-center justify-center">
            {!myAddressData && (
              <div className="mt-28">
                <Spinner />
              </div>
            )}
          </div>
          {myAddressData &&
            Array.isArray(myAddressData) &&
            myAddressData.map(
              (item) =>
                item.isDefault && (
                  <div
                    key={item.id}
                    className="flex flex-col items-center space-y-12"
                  >
                    <AddressRow
                      myAddressData={item}
                      profileUser={profileUser}
                    />
                    <Divider className="" />
                  </div>
                )
            )}
          {myAddressData &&
            Array.isArray(myAddressData) &&
            myAddressData.map(
              (item) =>
                !item.isDefault && (
                  <div
                    key={item.id}
                    className="flex flex-col items-center space-y-12"
                  >
                    <AddressRow
                      myAddressData={item}
                      profileUser={profileUser}
                    />
                    <Divider className="" />
                  </div>
                )
            )}
        </div>
        {Array.isArray(myAddressData) && myAddressData.length === 0 && (
          <div className="mt-8 flex h-full flex-col items-center justify-center space-y-20">
            <div className="mb-4 flex h-40 w-40 items-center justify-center rounded-full bg-slate-300 bg-opacity-10">
              <MapPinned size={96} strokeWidth={0.75} />
            </div>
            {"You don't have addresses yet."}
          </div>
        )}
      </div>
    </>
  );
}
