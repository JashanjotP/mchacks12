"use client"

import Image from "next/image";
import HomePage from './homepage'
import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import app from "@/firebase/config";

const db = getFirestore(app);

export default function Home() {
  const { user, error, isLoading } = useUser();
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      const analysisRes = await fetch('/api/parse-lease', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text : `LEASE
Parties
This lease made this 3rd day of April, 2023, between Aman Dhillon ("Landlord")
And
Tenant:
Tenant Name: Pranay Raju Harplani Dubey Cell No.: 226-501-7697
Passport No.: PAN151954 (Espana) Email Address: pharpala@uoguelph.ca
 (pranayinspain@gmail.com)
University of Guelph ID: 1249973
Premises
Landlord leases to Tenants and Tenants lease from Landlord, the property with improvements hereon described as the property situated in the
City of Guelph known as Unit 51 – 151 Clairfields Drive East ("Premises")
Term
This Lease shall commence on the 1st day of May 2023 ending April 30th, 2024
This Lease is valid for only the term specified May 1, 2023 ending April 30th, 2024 and cannot be extended past the end date. If the tenant(s)
wish to continue boarding they will be required to sign a new lease.
Rental
The Tenants shall promptly pay as monthly rental hereunder the sum of $800.00 payable to the landlord before the first day of each calendar
month via e-transfer. The Tenants agrees to pay a $25.00 charge for late rent charges as applied.
Room rented: Room D
Parking
The Tenants understands there will be a driveway space, garage and one visitor pass to be used at discretion of all Tenants who occupy the
premises.
Deposit
A deposit of $3,200.00 for the first and last three months' rent, as a nonrefundable deposit for the faithful agreement to take occupancy of the
premises for the agreed-upon term shall be paid within 24 hours of providing a signed copy of this lease. E-transfers, for the remaining months,
are payable on or before the first day of the following months during the Term.
Care and Maintenance of Premises
The Tenants accepts the premises in its present condition (please see Special Arrangements), and agrees to take appropriate care of the premises
and to make no alterations, additions, cosmetic or structural changes without the prior written consent of the Landlord. The Tenants agrees to
report promptly in writing to the Landlord when any portion of the premises is out of repair, and to promptly reimburse the landlord for any
damage to the premises or furnishings thereof caused by the negligence, misuse, or any other occurrence attributable to the tenant, or the Tenant's
family or guests.
Equipment
Any electrical or mechanical equipment which is a part of the premises, automatic range and ovens, refrigerator and freezing units, heating
equipment, will be delivered by the landlord in excellent working order. It is expressly understood that the tenant will properly operate, service,
and maintain all such equipment and surrender same in good operating order at the termination of this lease. Any service, maintenance, or repair
for other than worn out parts or equipment will be at the tenant's expenses.
Utilities
All utilities (any water, gas, hydro) used in or about the premises shall be paid for by the Tenant based on proportionate share. For clarity,
Landlord to pay utilities and Tenants to reimburse.
Occupancy
The premises shall be used only as a private residence to the Tenants specified on the lease, and for no other purpose, with the number of adults
residing therein not to exceed 4 except for short-term visiting guest residing therein not to exceed 8 adults. Neither the whole of the premises, nor
any portion thereof, shall be assigned or sublet by a Tenant or any other person without the prior written consent of the Landlord. The Tenant
accepts existing locks as safe and acceptable. In the event tenant changes or adds locks or security devices, keys or access shall be furnished to
the landlord. Tenant agrees the premises will not be advertised, rented or otherwise displayed on Airbnb.com or other such short-term rental
sites.
Liability of Landlord
The Landlord shall not be liable to the tenant or tenants invitees, family, employees, agents or servants for any personal injuries or damage to
personal property caused by defects, disrepair or faulty construction of the premises. The Tenant hereby agrees to indemnify and hold harmless
the landlord from and against any and all claims for damages to the premises or personal injury arising from tenants use of the premises, or from
any activity, work or things done, permitted or suffered by the tenant in or about the premises.
The Landlord shall not be liable for personal injuries or property damage or loss from theft, vandalism, fire, water, hurricane, rain, explosion, or
other unforeseen causes. Smoke detectors will be tested in the presence of the Tenant, and should never be disconnected by the Tenant
Tenants Insurance
The Tenant is hereby notified that landlord's insurance does not insure the tenant against loss of personal property on the premises due to fire,
theft, vandalism or other causes. He tenant is responsible for insurance on tenant's own property for fire and casualty loss and for the tenant's and
the tenant's family and guest for liability insurance coverage. The Tenant will provide a copy of their insurance coverage to the Landlord of the
day the tenant takes occupancy.
Inspection
The Landlord shall have the right to enter the premises at a 24 hrs notice, given to the tenant, and within reasonable hours to examine the
premises or to make repairs and to show the premises to prospective tenants or purchasers if required.
Smoking
The premises are a non-smoking and drug free residence. The Tenant has agreed not to smoke on or around the premise or engage in
any illegal activity at anytime nor will any visiting family or guests be permitted to smoke on or around the premises or engage in any
illegal activity.
Pets
The tenant(s) will have no pets.
Special Arrangements
Nil.
Miscellaneous
This lease shall constitute a full understanding between the parties herein, and no other Agreement unless in writing and signed by the parties
hereto shall be binding upon the subject property, except the attached Rental Application if any which shall become a part of the lease.
x__________________________________ x____________________________________________
Landlord: Aman Dhillon Tenant : Pranay Raju Harplani Dubey
Date: Date:_______________________________________
Schedule A – Site Plan
The site plan below indicates the names of the rooms located on the second floor of the Premises.
Please note the basement room will be known as "Room D"` }),
      });
      const data = await analysisRes.json();
      setAnalysis(data);
      console.log('Lease Analysis:', data);
    };

    fetchAnalysis();
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      if (user && user.sub) { // Check if user and user.sub exist
        console.log("User exists");
        console.log(user);
        try {
          const userRef = doc(db, 'users', user.sub);
          const userDoc = await getDoc(userRef);
          
          if (!userDoc.exists()) {
            await setDoc(userRef, {
              email: user.email || '',
              name: user.name || '',
              createdAt: new Date()
            });
          }
        } catch (err) {
          console.error("Error checking/creating user:", err);
        }
      }
    };

    checkUser();
  }, [user]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div>
      {user ? (
        <>
          <HomePage/>
          <a href="/api/auth/logout">Logout</a>
        </>
      ) : (
        <a href="/api/auth/login">Login</a>
      )}
    </div>
  );
}
